import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { Fragment, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { uploadFile } from "../../utils/storage-config/functions";
import { useDropzone } from "react-dropzone";
import { countryListAllIsoData } from "../../constants";
import Loader from "../Loader";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  createVerificationEntry,
  generateVerificationUrl,
  sendVerificationEmail,
} from "../../utils/emails-verification/verify";
import { useAuth } from "../ContextWrapper";

type FormData = {
  username: string;
  firstName: string;
  lastName: string;
  about: string;
  organization: string;
  email: string;
  country: string;
  province: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  profilePhoto: File;
  kycID: File;
  proofOfAddress: File;
};

export default function KYC() {
const {backendActor, identity} = useAuth()

  const [profilePhoto, setPP] = useState(null);
  const [kycID, setKYCID] = useState(null);
  const [proofOfAddress, setProofOfAddress] = useState(null);
  const [valid, setValid] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const { storageInitiated } = useSelector((state: RootState) => state.global);
  const [step, setStep] = useState(1);

  const MAX_FILE_SIZE = 500000;
  const ACCEPTED_FILE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  const schema = z.object({
    username: z
      .string()
      .min(3, { message: "Username must be 3 or more characters long" })
      .max(40, { message: "Username must be less than 40 characters long" }),
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters long" })
      .max(50, { message: "First name must be less than 50 characters long" }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters long" })
      .max(50, { message: "Last name must be less than 50 characters long" }),
    about: z
      .string()
      .min(20, { message: "About section must be at least 20 characters long" })
      .max(500, {
        message: "About section must be less than 500 characters long",
      }),
    organization: z
      .string()
      .min(3, {
        message: "Organization name must be at least 3 characters long",
      })
      .max(50, {
        message: "Organization name must be less than 50 characters long",
      }),
    email: z
      .string()
      .email({ message: "Please provide a valid email address" }),
    country: z
      .string()
      .min(3, { message: "Country name must be at least 3 characters long" })
      .max(40, {
        message: "Country name must be less than 40 characters long",
      }),
    province: z
      .string()
      .min(3, { message: "Province name must be at least 3 characters long" })
      .max(40, {
        message: "Province name must be less than 40 characters long",
      }),
    streetAddress: z
      .string()
      .min(5, { message: "Street address must be at least 5 characters long" })
      .max(100, {
        message: "Street address must be less than 100 characters long",
      }),
    city: z
      .string()
      .min(3, { message: "City name must be at least 3 characters long" })
      .max(40, { message: "City name must be less than 40 characters long" }),
    zipCode: z.number(),
    profilePhoto: z
      .any()
      .refine((files) => files?.length == 1, "Image is required.")
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        `Your file is too big, max file size is 5MB.`
      )
      .refine(
        (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
        ".jpg, .jpeg, .png and .webp files are accepted."
      ),
    kycID: z
      .any()
      .refine((files) => files?.length == 1, "Image is required.")
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        `Your file is too big, max file size is 5MB`
      )
      .refine(
        (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
        ".jpg, .jpeg, .png and .webp files are accepted."
      ),
    proofOfAddress: z
      .any()
      .refine((files) => files?.length == 1, "Image is required.")
      .refine(
        (files) => files?.[0]?.size <= MAX_FILE_SIZE,
        `Your file is too big, max file size is 5MB`
      )
      .refine(
        (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
        ".jpg, .jpeg, .png and .webp files are accepted."
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleSave = async (data: FormData) => {
    try {
      if (saving || !phoneNumber) {
        console.log("Very busy for now");
      } else {
        setSaving(true);
        const date = new Date();
        const timestamp = date.getTime();

        const profilePhotoUrl = await uploadAsset(data.profilePhoto[0]);
        console.log("profilePhoto saved", profilePhotoUrl);

        setStep(2);

        const kycIDUrl = await uploadAsset(data.kycID[0]);
        console.log("kyc id saved", kycIDUrl);

        setStep(3);

        const proofOfAddressUrl = await uploadAsset(data.proofOfAddress[0]);
        console.log("proof of Address saved", proofOfAddressUrl);

        const kycRequest = {
          id: String(uuidv4()),
          userId: identity.getPrincipal(),
          userName: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          about: data.about,
          email: data.email,
          organization: data.organization,
          country: data.country,
          streetAdrees: data.streetAddress,
          city: data.city,
          province: data.province,
          zipCode: BigInt(data.zipCode),
          phoneNumber: BigInt(phoneNumber),
          profilePhoto: profilePhotoUrl,
          kycIDCopy: kycIDUrl,
          proofOfAddressCopy: proofOfAddressUrl,
          status: "pending",
          dateCreated: BigInt(timestamp),
          isUpdated: false,
          isEmailVerified: false,
          membershipLevel: "general",
          userWebsite: "non",
          isFarmer: false,
          isBuyer: true,
          isStaff: false,
          pushNotification: {
            email: false,
            sms: false,
            everything: false,
          },
        };

        /// Sending verification email section

        let uniqueString: string = String(uuidv4());

        const verificationUrl = generateVerificationUrl(
          kycRequest.id,
          uniqueString
        );

        await createVerificationEntry(identity.getPrincipal(), kycRequest.id, uniqueString);

        await sendVerificationEmail(
          data.firstName,
          data.email,
          verificationUrl
        );

        const res = await backendActor.createKYCRequest(kycRequest);
        if (res) {
          setShow(true);
        } else {
          setShow(false);
        }
        setSaving(false);
        window.location.reload();
      }
    } catch (error) {
      console.log("Error when saving profile information", error);
    }
  };

  const handleChange = (event) => {
    if (event) {
      const input = event;
      setPhoneNumber(input);
      setValid(validatePhoneNumber(input));
    } else {
      console.log("Event object does not have a target property.");
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\d{10,13}$/;
    return phoneNumberPattern.test(phoneNumber);
  };

  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const uploadAsset = async (file) => {
    if (storageInitiated) {
      const file_path = location.pathname;
      try {
        const assetUrl = await uploadFile(file, file_path);
        console.log("This file was successfully uploaded:", file.name);
        return assetUrl;
      } catch (error) {
        console.error("Error uploading file:", file.name, error);
      }
    }
  };

  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    if (saving) {
      handleScrollToTop();
    }
  }, [saving]);

  // ------------------------------------FILE DRAGE AND DROP--------------------------------------------------------
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setPP(acceptedFiles);
    },
  });

  return (
    <>
      {saving && (
        <div className="flex flex-col gap-5 justify-center items-center px-7 lg:px-28 pt-8 pb-10 h-[70vh]">
          <h1 className="text-xl text-gray-500">
            We're saving your information. It should be done in under a minute.
            Thank you for your patience.
          </h1>
          <h1 className="text-lg text-gray-500 mt-3 mb-10">
            Step <span className="text-gray-700">{step}</span> of{" "}
            <span className="text-gray-700">3</span>:{" "}
            <span className="block">
              {step === 1 && "Saving your data…"}
              {step === 2 &&
                "Processing your request. Thanks for your patience."}
              {step === 3 && "Finalizing. Almost there. :)"}
            </span>
          </h1>

          <Loader />
        </div>
      )}
      {!saving && (
        <>
          <form onSubmit={handleSubmit(handleSave)}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Company Profile
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  This information will be displayed publicly.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Username
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary sm:max-w-md">
                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                          tswaanda.com/
                        </span>
                        <input
                          type="text"
                          required
                          {...register("username")}
                          name="username"
                          id="username"
                          className="block flex-1 border-0 bg-transparent py-2.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="company"
                        />
                      </div>
                      {errors.username && (
                        <span className="text-red-600">
                          {errors.username.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      About
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="about"
                        name="about"
                        {...register("about")}
                        rows={3}
                        className="block w-full bg-transparent rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.about && (
                      <span className="text-red-600">
                        {errors.about.message}
                      </span>
                    )}
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      Write a few sentences about organization.
                    </p>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Profile Photo
                    </label>

                    <div className="mt-2 flex items-center gap-x-3">
                      <UserCircleIcon
                        className="h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                      <label className="rounded-md cursor-pointer bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <span>Upload</span>
                        <input
                          {...register("profilePhoto")}
                          id="profilePhoto"
                          name="profilePhoto"
                          type="file"
                          accept="image/*, application/pdf"
                          onChange={(e) => setPP(e.target.files[0])}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    {errors.profilePhoto && (
                      <span className="text-red-600">
                        {errors.profilePhoto.message}
                      </span>
                    )}
                    <br />
                    {profilePhoto && (
                      <>
                        <span>File attached:</span>{" "}
                        <span>{profilePhoto.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      First name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="first-name"
                        {...register("firstName")}
                        id="first-name"
                        className="block w-full bg-transparent rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.firstName && (
                      <span className="text-red-600">
                        {errors.firstName.message}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Last name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        {...register("lastName")}
                        className="block w-full bg-transparent rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.lastName && (
                      <span className="text-red-600">
                        {errors.lastName.message}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        {...register("email")}
                        autoComplete="email"
                        className="block w-full bg-transparent rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-red-600">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="organization"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Organization name
                    </label>
                    <div className="mt-2">
                      <input
                        id="organization"
                        name="organization"
                        type="text"
                        {...register("organization")}
                        className="block w-full bg-transparent rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.organization && (
                      <span className="text-red-600">
                        {errors.organization.message}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone number
                    </label>
                    <div className="mt-2">
                      <PhoneInput
                        country={"zw"}
                        value={phoneNumber}
                        onChange={handleChange}
                        inputProps={{
                          required: true,
                        }}
                      />
                    </div>
                    {!valid && (
                      <p className="text-red-600">
                        Please enter a valid phone number.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Country
                    </label>
                    <div className="mt-2">
                      <select
                        id="country"
                        {...register("country")}
                        name="country"
                        autoComplete="country-name"
                        className="block w-full bg-transparent rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        {countryListAllIsoData.map((country, index) => (
                          <option key={index}>{country.name}</option>
                        ))}
                      </select>
                    </div>
                    {errors.country && (
                      <span className="text-red-600">
                        {errors.country.message}
                      </span>
                    )}
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="streetAddress"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Street address
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="streetAddress"
                        {...register("streetAddress")}
                        name="streetAddress"
                        className="block w-full bg-transparent rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.streetAddress && (
                      <span className="text-red-600">
                        {errors.streetAddress.message}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      City
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register("city")}
                        name="city"
                        id="city"
                        className="block w-full bg-transparent rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.city && (
                      <span className="text-red-600">
                        {errors.city.message}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="province"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      State / Province
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        {...register("province")}
                        name="province"
                        id="province"
                        className="block w-full bg-transparent rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.province && (
                      <span className="text-red-600">
                        {errors.province.message}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="postal-code"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      ZIP / Postal code
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        {...register("zipCode", { valueAsNumber: true })}
                        className="block w-full bg-transparent rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.zipCode && (
                      <span className="text-red-600">
                        {errors.zipCode.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  KYC Documents
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Upload documents with the high quality.
                </p>

                <div className="col-span-full pb-6 pt-6">
                  <label
                    htmlFor="kyc-di"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Passport/ID Scan
                  </label>

                  <div className="mt-2 flex items-center gap-x-3">
                    <label className="rounded-md cursor-pointer bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      <span>Upload file</span>
                      <input
                        id="kycID"
                        name="kycID"
                        {...register("kycID")}
                        type="file"
                        accept="image/*, application/pdf"
                        onChange={(e) => setKYCID(e.target.files[0])}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {errors.kycID && (
                    <span className="text-red-600">{errors.kycID.message}</span>
                  )}
                  <br />

                  {kycID && (
                    <>
                      <span>File attached:</span> <span>{kycID.name}</span>
                    </>
                  )}
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="proof-of-address"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Proof of Address{" "}
                    <span className="text-xs leading-6 text-gray-600">
                      (Utility/Bank Statement)
                    </span>
                  </label>

                  <div className="mt-2 flex items-center gap-x-3">
                    <label className="rounded-md cursor-pointer bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      <span>Upload file</span>
                      <input
                        id="proofOfAddress"
                        name="proofOfAddress"
                        {...register("proofOfAddress")}
                        type="file"
                        accept="image/*, application/pdf"
                        onChange={(e) => setProofOfAddress(e.target.files[0])}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {errors.proofOfAddress && (
                    <span className="text-red-600">
                      {errors.proofOfAddress.message}
                    </span>
                  )}
                  <br />
                  {proofOfAddress && (
                    <>
                      <span>File attached:</span>{" "}
                      <span>{proofOfAddress.name}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Notifications
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  We'll always let you know about important changes, but you
                  pick what else you want to hear about.
                </p>

                <div className="mt-10 space-y-10">
                  <fieldset>
                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                      Push Notifications
                    </legend>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      These are delivered via SMS to your mobile phone.
                    </p>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <input
                          id="push-everything"
                          name="push-notifications"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="push-everything"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Everything
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="push-email"
                          name="push-notifications"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="push-email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Same as email
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="push-nothing"
                          name="push-notifications"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="push-nothing"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          No push notifications
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Save
              </button>
            </div>

            <>
              <div
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
              >
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                  {/* Notification panel, dynamically insert this into the live province when it needs to be displayed */}
                  <Transition
                    show={show}
                    as={Fragment}
                    enter="transform ease-out duration-300 transition"
                    enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                    enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckCircleIcon
                              className="h-6 w-6 text-green-400"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium text-gray-900">
                              Successfully saved!
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              If you wish to update, use profile tab
                            </p>
                          </div>
                          <div className="ml-4 flex flex-shrink-0">
                            <button
                              type="button"
                              className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => {
                                setShow(false);
                              }}
                            >
                              <span className="sr-only">Close</span>
                              <XMarkIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </>
          </form>
        </>
      )}
    </>
  );
}
