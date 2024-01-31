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
    } else if ("NewProductDrop") {
        let res = {
            title : "Tswaanda New Product Drop",
            message: message.FromAdmin.NewProductDrop.productName
        }
      return res;
    }
  } else {
    return {
      message: "Unknown message",
    };
  }
};

export const getStatus = (status: string) => {
  if (status === "order_placed") {
    let res = {
      message: "A new order has been placed",
    };
    return res;
  } else if (status === "kyc_created") {
    let res = {
      message: "A new KYC has been created",
    };
    return res;
  } else if (status === "product_review") {
    let res = {
      message: "A new product review has been created",
    };
    return res;
  }
};
