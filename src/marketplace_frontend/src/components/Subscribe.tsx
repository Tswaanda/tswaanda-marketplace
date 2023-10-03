import React, { useState } from "react";
import handler from "../api/subscribe";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import {
  generateNewsLetterVerificationUrl,
  sendNewsLetterVerificationEmail,
} from "../utils/emails-verification/verify";
import SubscriptionModal from "./SubscriptionModal";
import { NewsLetterSubscription } from "../utils/types";
import Subscribed from "./Subscribed";
import { useAuth } from "./ContextWrapper";

type FormData = {
  email: string;
};

function SubscribeForm() {
const { backendActor } = useAuth()

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [subNVerified, setSubNVerified] = useState(false);
  const [subNUnverified, setSubNUnverified] = useState(false);
  const [entry, setEntry] = useState(null)
  const [subed, setSubed] = useState(false);
  const schema = z.object({
    email: z
      .string()
      .email({ message: "Please provide a valid email address" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const submitRequest = async (data: FormData) => {
    setLoading(true);

    // Checking if the email is already subscribed
    const response = (await backendActor.checkIfEmailSubscribed(
      data.email
    )) as [NewsLetterSubscription];

    setEntry(response[0])

    if (response.length > 0) {
      setSubed(true);
      if (response[0].isVerified) {
        setSubNVerified(true);
        setSubNUnverified(false)
        setLoading(false);
      } else {
        setSubNUnverified(true);
        setSubNVerified(false)
        setLoading(false);
      }
    } else {
      // Subscribing and sending email is verified
      try {
        const requestObj = {
          id: String(uuidv4()),
          email: data.email,
          isVerified: false,
          created: Date.now(),
        };

        await backendActor.addToNewsLetterSubscibers(requestObj);

        const url = generateNewsLetterVerificationUrl(requestObj.id);

        await sendNewsLetterVerificationEmail(data.email, url);
        setLoading(false);
        setShowModal(true);
      } catch (error) {
        setLoading(false);
        console.log("Error when sending subscription request", error);
      }
    }
  };

  const resendEmail = async () => {
    setLoading(true)
    setSubed(false)
    const url = generateNewsLetterVerificationUrl(entry.id);
    await sendNewsLetterVerificationEmail(entry.email, url);
    setLoading(false);
    setShowModal(true);
  }

  return (
    <section>
      <div className="py-8 px-4 mx-auto lg:my-24 max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md sm:text-center">
          <h2 className="mb-4 text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl dark:text-primary">
            Sign up for our newsletter
          </h2>
          <p className="mx-auto mb-8 max-w-2xl font-light text-gray-500 md:mb-12 sm:text-xl dark:text-gray-400">
            Stay up to date with the roadmap progress, announcements and
            exclusive discounts feel free to sign up with your email.
          </p>
          <form onSubmit={handleSubmit(submitRequest)}>
            <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
              <div className="relative w-full">
                <label
                  htmlFor="email"
                  className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Email address
                </label>
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <input
                  className="block p-3 pl-10 w-full text-sm text-gray-900 bg-white rounded-lg border border-primary sm:rounded-none sm:rounded-l-lg focus:ring-primary focus:border-primary dark:bg-white dark:border-primary dark:placeholder-gray-500 dark:text-black dark:focus:ring-primary dark:focus:border-primary"
                  placeholder="Enter your email"
                  {...register("email")}
                  id="email"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={` ${
                    loading ? `bg-green-300 text-green-900` : ``
                  } py-3 px-5 w-full text-sm font-medium text-center text-primary rounded-lg border cursor-pointer bg-primary-700 border-primary sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                >
                  {loading ? "Processing..." : "Subscribe"}
                </button>
              </div>
            </div>
            {errors.email && (
              <span className="text-red-600">{errors.email.message}</span>
            )}
            <div className="mx-auto max-w-screen-sm text-sm text-left text-gray-600 newsletter-form-footer dark:text-gray-700">
              We care about the protection of your data.
              <a
                href="#"
                className="font-medium text-primary dark:text-primary hover:underline"
              >
                Read our Privacy Policy
              </a>
              .
            </div>
          </form>
        </div>
        {showModal ? <SubscriptionModal /> : null}
        {subed && <Subscribed {...{subNVerified, subNUnverified, setSubed, resendEmail}} />}
      </div>
    </section>
  );
}

export default SubscribeForm;
