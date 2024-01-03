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
