import { FC, useEffect, useRef, useState } from "react";
import { ProductOrder } from "../../../declarations/marketplace_backend/marketplace_backend.did";
import { OrderStage } from "../types/types";
import { useAuth } from "../../../hooks/ContextWrapper";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";

type Props = {
  orderStage: OrderStage;
  order: ProductOrder;
};

const IFrame: FC<Props> = ({ orderStage, order }) => {
  const { backendActor } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [invoiceDownloaded, setInvoiceDownloaded] = useState(
    order.invoicePDF !== "" && orderStage === "orderplaced"
  );

  console.log(order, invoiceDownloaded);

  useEffect(() => {
    function receivePayloadFromIframe(event) {
      const receivedInterfacesPayload = JSON.parse(event.data);
      switch (receivedInterfacesPayload.type) {
        case "message":
          // to receive the user input
          console.log("recieved message".toUpperCase(), receivedInterfacesPayload.value)
          switch (receivedInterfacesPayload.value) {
            case "Offer accepted":
              handleInvoiceDownloaded();
              break;
            case "Payment made":
              handlePurchased();
              break;
            case "shipment":
              console.log("shipment");
              break;
            case "fulfillment":
              console.log("fulfillment");
              break;
            case "dispute":
              console.log("dispute");
              break;
            case "message":
              console.log("message");
              break;
            default:
              console.log("undefined");
          }
          break;
        case "state":
          // use this to know that page has loaded and wait 2sec just to make sure
          console.log(
            "recieved state message".toUpperCase(),
            receivedInterfacesPayload.value
          );
          setIframeLoaded(true);

          break;
        default:
          console.log("undefined");
      }
    }
    // Use "message" as the event type to listen for messages from the iframe
    window.addEventListener("message", receivePayloadFromIframe);
    return () => {
      window.removeEventListener("message", receivePayloadFromIframe);
    };
  }, []);

  useEffect(() => {
    if (iframeLoaded) {
      setTimeout(() => {
        handleOrderStage();
      }, 2000);
    }
  }, [iframeLoaded]);

  useEffect(() => {
    if (invoiceDownloaded && iframeLoaded && orderStage === "orderplaced") {
      setTimeout(() => {
        sendPurchaseDetailsToWallet();
      }, 2000);
    }
  }, [invoiceDownloaded, iframeLoaded]);

  const handleOrderStage = () => {
    switch (orderStage) {
      case "orderplaced":
        if (order.invoicePDF === "") {
          sendOfferDetailsToWallet();
        }
        break;
      case "purchased":
        sendShipmentDetailsToWallet();
        break;
      case "shipped":
        return "shipped";
      case "delivered":
        return "delivered";
      case "cancelled":
        return "cancelled";
      default:
        return "error";
    }
  };

  console.log(orderStage, order.invoicePDF, invoiceDownloaded)

  const handleInvoiceDownloaded = async () => {
    if (order.invoicePDF === "") {
      let updatedOrder: ProductOrder = {
        ...order,
        invoicePDF: "invoice.pdf",
      };
      await backendActor.updatePOrder(updatedOrder);
      setInvoiceDownloaded(true);
      sendPurchaseDetailsToWallet();
    } else {
      sendPurchaseDetailsToWallet();
    }
  };

  const handlePurchased = async () => {
    let updatedOrder: ProductOrder = {
      ...order,
      orderStage: { purchased: null },
    };
    await backendActor.updatePOrder(updatedOrder);
    order = updatedOrder;
    sendExportDetailsToWallet();
    sendShipmentDetailsToWallet();
  };

  const sendOfferDetailsToWallet = () => {
    const offerDetails = {
      type: "offer",
      value: {
        logo: "../../assets/images/logo.png",
        logoWidth: 100,
        title: "Oder",
        companyName: "Tswaanda Company",
        name: order.name,
        companyAddress: order.companyAddress,
        companyAddress2: order.companyAddress2,
        companyCountry: order.companyCountry,
        billTo: order.billTo,
        clientName: order.clientName,
        clientAddress: order.clientAddress,
        clientAddress2: order.clientAddress2,
        clientCountry: order.clientCountry,
        invoiceTitleLabel: order.invoiceTitleLabel,
        invoiceTitle: order.invoiceTitle,
        invoiceDateLabel: order.invoiceDateLabel,
        invoiceDate: order.invoiceDate,
        invoiceDueDateLabel: order.invoiceDueDateLabel,
        invoiceDueDate: "", // TODO: fix due date issue
        productLineDescription: order.productLineDescription,
        productLineQuantity: order.productLineQuantity,
        productLineQuantityRate: order.productLineQuantityRate,
        productLineQuantityAmount: order.productLineQuantityAmount,
        productLines: [
          {
            description: order.productLineDescription,
            quantity: order.productLineQuantity,
            rate: order.productLineQuantityRate,
          },
        ],
        subTotalLabel: order.subTotalLabel,
        taxLabel: order.taxLabel,
        totalLabel: order.totalLabel,
        currency: order.currency,
        notesLabel: order.notesLabel,
        notes: order.notes,
        termLabel: order.termLabel,
      },
    };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(offerDetails),
        "*"
      );
    } else {
      console.log("No iframe");
    }
  };

  const sendSupportMessageToWallet = () => {
    let message = { type: "message", value: "Hello, how can I help you?" };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(JSON.stringify(message), "*");
    }
  };

  const sendCheckoutDetailsToWallet = () => {
    let purchaseDetails = { type: "name", value: "Tswaanda" };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(purchaseDetails),
        "*"
      );
    }
  };

  const sendPurchaseDetailsToWallet = () => {
    let purchaseDetails = {
      type: "purchase",
      value: {
        walletOwner: "",
        accountNumber: "",
        paymentDate: "",
        orderNumber: "",
      },
    };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(purchaseDetails),
        "*"
      );
    }
  };

  const sendExportDetailsToWallet = () => {
    let purchaseDetails = { type: "export", value: "" };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(purchaseDetails),
        "*"
      );
    }
  };

  const sendShipmentDetailsToWallet = () => {
    let purchaseDetails = { type: "shipment", value: "" };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(purchaseDetails),
        "*"
      );
    }
  };

  const sendFulfillmentDetailsToWallet = () => {
    let purchaseDetails = { type: "fulfillment", value: "" };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(purchaseDetails),
        "*"
      );
    }
  };

  const sendDisputeDetailsToWallet = () => {
    let purchaseDetails = { type: "dispute", value: "" };
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.style.display = "block";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify(purchaseDetails),
        "*"
      );
    }
  };

  return (
    <div className="w-full">
      <div>
        <div className="">
          <Link
            to="/orders"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-600"
          >
            <IoArrowBack className="text-2xl text-gray-500" />
            <span>Orders</span>
          </Link>
        </div>

        <div className="">
          <div className="w-full h-full flex flex-col justify-center items-center">
            {orderStage === "orderplaced" && !invoiceDownloaded && (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <p className="text-center text-lg font-bold">
                  Download the invoice and select Ok{" "}
                </p>
              </div>
            )}
            {orderStage === "orderplaced" && invoiceDownloaded && (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <p className="text-center text-lg font-bold">
                  Make payment and select Ok{" "}
                </p>
              </div>
            )}
          </div>
          <iframe
            ref={iframeRef}
            src="https://5mrk6-yqaaa-aaaam-ab2iq-cai.raw.icp0.io"
            title="Checkout Iframe"
            width="750"
            height="950"
            suppressHydrationWarning={true}
            style={{ display: "block", border: "none", margin: "0 auto" }}
            sandbox="allow-same-origin allow-scripts"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default IFrame;
