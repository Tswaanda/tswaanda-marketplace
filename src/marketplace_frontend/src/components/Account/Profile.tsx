import React, { useEffect, useState } from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { v4 as uuidv4 } from "uuid";
import Loader from "../Loader";
import { toast } from "react-toastify";
import { Result } from "../../utils/types";
import {
  createVerificationEntry,
  generateVerificationUrl,
  sendVerificationEmail,
} from "../../utils/emails/verify";
import SubscriptionModal from "../SubscriptionModal";
import { ThreeCircles } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { deleteAsset, uploadFile } from "../../utils/storage-config/functions";
import { useAuth } from "../ContextWrapper";

const Profile = ({ activate }) => {
  const {backendActor , identity} = useAuth();

  const { storageInitiated } = useSelector((state: RootState) => state.global);
  const [userInfo, setUserInfo] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [noUser, setNoUser] = useState(false);

  const [email, setEmail] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [proofOfAddress, setProofOfAddress] = useState(null);
  const [idCopy, setIdCopy] = useState(null);
  const [idTooBig, setIdTooBig] = useState(false);
  const [addresFileTooBig, setAddresFileTooBig] = useState(false);

  // update useStates
  const [isEditNameMode, setIsEditNameMode] = useState(false);
  const [isEditEmailMode, setIsEditEmailMode] = useState(false);
  const [isEditCompanyMode, setIsEditCompanyMode] = useState(false);
  const [isEditAboutMode, setIsEditAboutMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFirstNameChange = (value) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      firstName: value,
    }));
  };

  const handleEmailChange = (value) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      email: value,
    }));
  };

  const handleLastNameChange = (value) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      lastName: value,
    }));
  };

  const handleCompanyChange = (value) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      organization: value,
    }));
  };

  const handleAboutChange = (value) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      about: value,
    }));
  };

  const handleIdCopyChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSize = 5 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setIdTooBig(true);
        setIdCopy(selectedFile);
      } else {
        setIdCopy(selectedFile);
        setIdTooBig(false);
      }
    }
  };

  const handleAddressCopyChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSize = 5 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setAddresFileTooBig(true);
        setProofOfAddress(selectedFile);
      } else {
        setProofOfAddress(selectedFile);
        setAddresFileTooBig(false);
      }
    }
  };

  const updateProfileIdCopy = async () => {
    setUpdating(true);
    try {
      console.log("Updating id file");
      await deleteAsset(userInfo.kycIDCopy);
      const idCopyUrl = await uploadAsset(idCopy);
      console.log("Profile id copy saved", idCopyUrl);
      const updatedObject = {
        ...userInfo,
        kycIDCopy: idCopyUrl,
        status: "pending",
        isUpdated: true,
      };
      await backendActor.updateKYCRequest(userInfo.userId, updatedObject);
      toast.success("Profile Information updated", {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
      });
      setUpdating(false);
      setIdCopy(null);
      setIdTooBig(false);
    } catch (error) {
      setUpdating(false);
      console.log("Error when updating profile id copy");
    }
  };

  const updateProfileProofOfAddress = async () => {
    setUpdating(true);
    try {
      console.log("Updating id file");
      await deleteAsset(userInfo.proofOfAddressCopy);
      const addressUrl = await uploadAsset(proofOfAddress);
      console.log("address file saved", addressUrl);
      const updatedObject = {
        ...userInfo,
        proofOfAddressCopy: addressUrl,
        status: "pending",
        isUpdated: true,
      };
      await backendActor.updateKYCRequest(userInfo.userId, updatedObject);
      toast.success("Profile Information updated", {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
      });
      setUpdating(false);
      setProofOfAddress(null);
      setAddresFileTooBig(false);
    } catch (error) {
      setUpdating(false);
      console.log("Error when updating profile id copy");
    }
  };

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

  const getCustomerInfo = async () => {
    setLoading(true);
    try {
      const res: Result = await backendActor.getKYCRequest(identity.getPrincipal());
      if (res.ok) {
        setUserInfo(res.ok);
        setEmail(res.ok.email);
        setLoading(false);
      } else if (res.err) {
        setNoUser(true);
        setLoading(false);
      }
    } catch (error) {
      console.log(error, "error here");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (identity) {
      getCustomerInfo();
    }
  }, [identity]);

  const initProfileUpdate = async (field: string) => {
    setUpdating(true);
    if (field === "first-last-name") {
      await updateProfile();
      setIsEditNameMode(false);
    } else if (field === "organization") {
      await updateProfile();
      setIsEditCompanyMode(false);
    } else if (field === "about") {
      await updateProfile();
      setIsEditAboutMode(false);
    } else if (field === "email") {
      await updateEmail();
      setIsEditEmailMode(false);
    }
  };

  const updateProfile = async () => {
    try {
      const res = await backendActor.updateKYCRequest(
        userInfo.userId,
        userInfo
      );
      console.log(res);
      toast.success("Profile Information updated", {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
      });
      setUpdating(false);
    } catch (error) {
      setUpdating(false);
      console.log("Error when updating user information", error);
    }
  };

  const updateEmail = async () => {
    try {
      if (email === userInfo.email) {
        console.log("Not updating the email is the same");
        setUpdating(false);
      } else {
        await backendActor.updateKYCRequest(userInfo.userId, userInfo);

        let uniqueString: string = String(uuidv4());
        const url = generateVerificationUrl(userInfo.id, uniqueString);

        await createVerificationEntry(
          userInfo.userId,
          userInfo.id,
          uniqueString
        );

        await sendVerificationEmail(userInfo.firstName, userInfo.email, url);
        setUpdating(false);
        setShowModal(true);
      }
    } catch (error) {
      console.log("Error when updating email", error);
      setUpdating(false);
    }
  };

  return (
    <>
      {userInfo && (
        <div>
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Account Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Personal details and application.
              </p>
            </div>
            <div>
              <span className="inline-flex items-center rounded-md bg-red-200 px-2.5 py-0.5 text-sm font-medium text-red-500">
                <svg
                  className="-ml-0.5 mr-1.5 h-2 w-2 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 8 8"
                >
                  <circle cx={4} cy={4} r={3} />
                </svg>
                {userInfo.status === "pending"
                  ? "Pending verification"
                  : "Verified"}
              </span>
            </div>
          </div>
          <div className="mt-5 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              <form action="">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt className="text-sm font-medium text-gray-500">
                    Full name
                  </dt>
                  <dd className="mt-1 items-center flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {isEditNameMode ? (
                      <div className="flex gap-4">
                        <div>
                          <input
                            type="text"
                            value={userInfo.firstName}
                            onChange={(e) =>
                              handleFirstNameChange(e.target.value)
                            }
                            className="w-full/2 bg-transparent rounded-md border-0 py-1 pl-2 mr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                          />
                          <span
                            className={`mt-1 text-red-600 text-xs" ${
                              userInfo.firstName ? `hidden` : `block`
                            }`}
                          >
                            First name is required
                          </span>
                        </div>
                        <div className="">
                          <input
                            type="text"
                            value={userInfo.lastName}
                            onChange={(e) =>
                              handleLastNameChange(e.target.value)
                            }
                            className="w-full/2 bg-transparent rounded-md border-0 py-1 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                          />
                          <span
                            className={`mt-1 text-red-600 text-xs" ${
                              userInfo.lastName ? `hidden` : `block`
                            }`}
                          >
                            Last name is required
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="flex-grow">
                        {userInfo.firstName} {userInfo.lastName}
                      </span>
                    )}

                    <span className="ml-4 flex-shrink-0">
                      {isEditNameMode ? (
                        <>
                          <button
                            type="submit"
                            disabled={
                              !userInfo.firstName ||
                              !userInfo.lastName ||
                              updating
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              initProfileUpdate("first-last-name");
                            }}
                            className="rounded-md ml-5 px-3 font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                          >
                            {updating ? (
                              <ThreeCircles
                                height="20"
                                width="20"
                                color="#4fa94d"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                                ariaLabel="three-circles-rotating"
                                outerCircleColor=""
                                innerCircleColor=""
                                middleCircleColor=""
                              />
                            ) : (
                              "Save"
                            )}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEditNameMode(true);
                          }}
                          className="rounded-md font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          Update
                        </button>
                      )}
                    </span>
                  </dd>
                </div>
              </form>
              <form action="">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {isEditEmailMode ? (
                      <div className="flex-grow">
                        <input
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          required
                          className="w-full bg-transparent rounded-md border-0 py-1 pl-2 mr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        />
                        <span
                          className={`mt-1 text-red-600 text-xs" ${
                            email ? `hidden` : `block`
                          }`}
                        >
                          Email is required
                        </span>
                      </div>
                    ) : (
                      <span className="flex-grow">
                        <span className="flex-grow">{email}</span>
                      </span>
                    )}

                    <span className="ml-4 flex-shrink-0">
                      {isEditEmailMode ? (
                        <button
                          type="submit"
                          disabled={!email || updating}
                          onClick={(e) => {
                            e.preventDefault();
                            initProfileUpdate("email");
                          }}
                          className="rounded-md ml-5 px-3 font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          {updating ? (
                            <ThreeCircles
                              height="20"
                              width="20"
                              color="#4fa94d"
                              wrapperStyle={{}}
                              wrapperClass=""
                              visible={true}
                              ariaLabel="three-circles-rotating"
                              outerCircleColor=""
                              innerCircleColor=""
                              middleCircleColor=""
                            />
                          ) : (
                            "Save"
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEditEmailMode(true);
                          }}
                          className="rounded-md  font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          Update
                        </button>
                      )}
                    </span>
                  </dd>
                </div>
                {showModal && <SubscriptionModal />}
              </form>
              <form action="">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt className="text-sm font-medium text-gray-500">
                    Organization Name
                  </dt>
                  <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {isEditCompanyMode ? (
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={userInfo.organization}
                          onChange={(e) => handleCompanyChange(e.target.value)}
                          className="w-full bg-transparent rounded-md border-0 py-1 pl-2 mr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        />
                        <span
                          className={`mt-1 text-red-600 text-xs" ${
                            userInfo.organization ? `hidden` : `block`
                          }`}
                        >
                          Organization name is required
                        </span>
                      </div>
                    ) : (
                      <span className="flex-grow">{userInfo.organization}</span>
                    )}
                    <span className="ml-4 flex-shrink-0">
                      {isEditCompanyMode ? (
                        <button
                          type="submit"
                          disabled={!userInfo.organization || updating}
                          onClick={(e) => {
                            e.preventDefault();
                            initProfileUpdate("organization");
                          }}
                          className="rounded-md ml-5 px-3 font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          {updating ? (
                            <ThreeCircles
                              height="20"
                              width="20"
                              color="#4fa94d"
                              wrapperStyle={{}}
                              wrapperClass=""
                              visible={true}
                              ariaLabel="three-circles-rotating"
                              outerCircleColor=""
                              innerCircleColor=""
                              middleCircleColor=""
                            />
                          ) : (
                            "Save"
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEditCompanyMode(true);
                          }}
                          className="rounded-md  font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          Update
                        </button>
                      )}
                    </span>
                  </dd>
                </div>
              </form>
              <form action="">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                  <dt className="text-sm font-medium text-gray-500">About</dt>
                  <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {isEditAboutMode ? (
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={userInfo.about}
                          onChange={(e) => handleAboutChange(e.target.value)}
                          className="w-full bg-transparent rounded-md border-0 py-1 pl-2 mr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                        />
                        <span
                          className={`mt-1 text-red-600 text-xs" ${
                            userInfo.about ? `hidden` : `block`
                          }`}
                        >
                          About name is required
                        </span>
                      </div>
                    ) : (
                      <span className="flex-grow">{userInfo.about}</span>
                    )}
                    <span className="ml-4 flex-shrink-0">
                      {isEditAboutMode ? (
                        <button
                          type="submit"
                          disabled={!userInfo.about || updating}
                          onClick={(e) => {
                            e.preventDefault();
                            initProfileUpdate("about");
                          }}
                          className="rounded-md ml-5 px-3 font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          {updating ? (
                            <ThreeCircles
                              height="20"
                              width="20"
                              color="#4fa94d"
                              wrapperStyle={{}}
                              wrapperClass=""
                              visible={true}
                              ariaLabel="three-circles-rotating"
                              outerCircleColor=""
                              innerCircleColor=""
                              middleCircleColor=""
                            />
                          ) : (
                            "Save"
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEditAboutMode(true);
                          }}
                          className="rounded-md font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                          Update
                        </button>
                      )}
                    </span>
                  </dd>
                </div>
              </form>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dt className="text-sm font-medium text-gray-500">
                  KYC Attachments
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-gray-200 rounded-md border border-gray-200"
                  >
                    <li className="">
                      <div className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                        <div className="flex w-0 flex-1 items-center">
                          <PaperClipIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="ml-2 w-0 flex-1 truncate">
                            Passport/ID-Copy pdf
                          </span>
                        </div>
                        <div className="ml-4 flex flex-shrink-0 space-x-4">
                          {idCopy && !idTooBig ? (
                            <button
                              onClick={updateProfileIdCopy}
                              className="rounded-md font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                              {updating ? (
                                <ThreeCircles
                                  height="20"
                                  width="20"
                                  color="#4fa94d"
                                  wrapperStyle={{}}
                                  wrapperClass=""
                                  visible={true}
                                  ariaLabel="three-circles-rotating"
                                  outerCircleColor=""
                                  innerCircleColor=""
                                  middleCircleColor=""
                                />
                              ) : (
                                "Save File"
                              )}
                            </button>
                          ) : (
                            <button className="rounded-md font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                              <form>
                                <label htmlFor="id-copy" className="">
                                  {idCopy && idTooBig
                                    ? "Change File"
                                    : "Update"}
                                </label>
                                <input
                                  type="file"
                                  name="id-copy"
                                  id="id-copy"
                                  onChange={handleIdCopyChange}
                                  className="hidden"
                                  accept="application/pdf, image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
                                />
                              </form>
                            </button>
                          )}
                          <span className="text-gray-300" aria-hidden="true">
                            |
                          </span>
                          <a href={userInfo.kycIDCopy}>
                            <button className="rounded-md font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                              View
                            </button>
                          </a>
                        </div>
                      </div>
                      {idCopy && (
                        <div className="flex gap-5 px-3 items-center">
                          {idTooBig ? (
                            <span className="text-red-600">
                              File too big. Must be less than 5MB
                            </span>
                          ) : (
                            <span>{idCopy.name}</span>
                          )}
                        </div>
                      )}
                    </li>
                    <li className="">
                      <div className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                        <div className="flex w-0 flex-1 items-center">
                          <PaperClipIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="ml-2 w-0 flex-1 truncate">
                            Proof-of-Address pdf
                          </span>
                        </div>
                        <div className="ml-4 flex flex-shrink-0 space-x-4">
                          {proofOfAddress && !addresFileTooBig ? (
                            <button
                              onClick={updateProfileProofOfAddress}
                              className="rounded-md font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                              {updating ? (
                                <ThreeCircles
                                  height="20"
                                  width="20"
                                  color="#4fa94d"
                                  wrapperStyle={{}}
                                  wrapperClass=""
                                  visible={true}
                                  ariaLabel="three-circles-rotating"
                                  outerCircleColor=""
                                  innerCircleColor=""
                                  middleCircleColor=""
                                />
                              ) : (
                                "Save File"
                              )}
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="rounded-md font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                              <form>
                                <label htmlFor="address-copy" className="">
                                  {proofOfAddress && addresFileTooBig
                                    ? "Change File"
                                    : "Update"}
                                </label>
                                <input
                                  type="file"
                                  name="address-copy"
                                  id="address-copy"
                                  onChange={handleAddressCopyChange}
                                  className="hidden"
                                  accept="application/pdf, image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
                                />
                              </form>
                            </button>
                          )}

                          <span className="text-gray-300" aria-hidden="true">
                            |
                          </span>
                          <a href={userInfo.proofOfAddressCopy}>
                            <button
                              type="button"
                              className="rounded-md font-medium text-primary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                              View
                            </button>
                          </a>
                        </div>
                      </div>
                      {proofOfAddress && (
                        <div className="flex gap-5 px-3 items-center">
                          {addresFileTooBig ? (
                            <span className="text-red-600">
                              File too big. Must be less than 5MB
                            </span>
                          ) : (
                            <span>{proofOfAddress.name}</span>
                          )}
                        </div>
                      )}
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center px-7 lg:px-28 pt-8 pb-10 h-[70vh]">
          <Loader />
        </div>
      )}
      {noUser && (
        <div className="text-gray-600">
          Nothing to see yet! Lets get to know you... Complete your{" "}
          <button
            className="font-bold text-primary"
            onClick={() => activate("Account")}
          >
            account details.
          </button>
        </div>
      )}
    </>
  );
};

export default Profile;
