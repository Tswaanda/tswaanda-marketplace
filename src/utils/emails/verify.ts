import emailjs from "@emailjs/browser";
import { backendActor } from "../../hooks/config";
import { Principal } from "@dfinity/principal";

const environment = process.env.DFX_NETWORK;

export const generateVerificationUrl = (userId: string, uniqueId: string) => {
  const baseUrl =
    environment === "ic"
      ? "https://tswaanda.com/verify-email"
      : "http://localhost:8080/verify-email";
  const verificationUrl = `${baseUrl}/${userId}/${uniqueId}`;
  return verificationUrl;
};

export const generateNewsLetterVerificationUrl = (id: string) => {
  const baseUrl =
    environment === "ic"
      ? "https://tswaanda.com/verify-email"
      : "http://localhost:8080/verify-email";
  const verificationUrl = `${baseUrl}/${id}`;
  return verificationUrl;
};

export const createVerificationEntry = async (
  userPrincipal: Principal,
  userId: string,
  uniqueString: string
) => {
  try {
    const args = {
      userId: userId,
      userPrincipal: userPrincipal,
      hashedUniqueString: uniqueString,
      created: BigInt(Date.now()),
      expires: BigInt(Date.now() + 21600000),
    };

    await backendActor.addToUnverified(userId, args);
  } catch (error) {
    console.log("Error when saving unverified email entry", error);
  }
};

export const sendVerificationEmail = async (
  user_name: string,
  email: string,
  url: string
) => {
  const templateParams = {
    to_name: user_name,
    to_user_email: email,
    verification_url: url,
  };

  emailjs
    .send(
      "service_bsld0fh",
      "template_85wx5f6",
      templateParams,
      "cEuqVJj0eDt8tfwPN"
    )
    .then(
      (result) => {
        console.log("SUCCESS!", result.status, result.text);
        console.log("message was sent");
      },
      (error) => {
        console.log(error);
      }
    );
};

export const sendNewsLetterVerificationEmail = async (
  email: string,
  url: string
) => {
  const templateParams = {
    to_user_email: email,
    verification_url: url,
  };

  emailjs
    .send(
      "service_bsld0fh",
      "template_2sansn6",
      templateParams,
      "cEuqVJj0eDt8tfwPN"
    )
    .then(
      (result) => {
        console.log("SUCCESS!", result.status, result.text);
        console.log("message was sent");
      },
      (error) => {
        console.log(error);
      }
    );
};
