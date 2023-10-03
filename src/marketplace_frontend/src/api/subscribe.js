import { Buffer } from "buffer";

function getRequestParams(email) {
  const API_KEY = import.meta.env.VITE_MAILCHIMP_API_KEY;
  const LIST_ID = import.meta.env.VITE_MAILCHIMP_LIST_ID;

  const DATACENTER = API_KEY.split("-")[1];
  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  const data = {
    email_address: email,
    status: "subscribed",
  };

  const base64ApiKey = Buffer.from(`anystring:${API_KEY}`).toString("base64");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${base64ApiKey}`,
  };

  return { url, data, headers };
}

export default async function handler(email, errHandler) {
  if (!email || !email.length) {
    errHandler({ error: "Please enter a email address" });
  }
  try {
    const { url, data, headers } = getRequestParams(email);

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        email_address: data.email_address,
        status: data.status,
      }),
    });

    errHandler({
      error: null,
    });
  } catch (err) {
    errHandler({
      error: err,
    });
  }
}
