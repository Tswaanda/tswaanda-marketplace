import { AppMessage } from "../declarations/tswaanda_backend/tswaanda_backend.did";

export const processWsMessage = (message: AppMessage) => {
  if ("FromAdmin" in message) {
    if ("OrderUpdate" in message.FromAdmin) {
        let res = {
            title : "Tswaanda Order Update",
            message: message.FromAdmin.OrderUpdate.message,
        }
      return res;
    } else if ("KYCUpdate" in message.FromAdmin) {
        let res = {
            title : "Tswaanda KYC Update",
            message: message.FromAdmin.KYCUpdate.message,
        }
      return res;
    }
  } else {
    return {
      message: "Unknown message",
    };
  }
};

const getStatus = (status: string) => {
  if (status === "order_placed") {
    let message: string = "A new order has been placed";
    let res = {
      message: message,
    };
    return res;
  } else if (status === "kyc_created") {
    let message: string = "A new KYC has been created";
    let res = {
      message: message,
    };
    return res;
  }
};
