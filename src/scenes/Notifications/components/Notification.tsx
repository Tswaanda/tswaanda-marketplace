import React, { FC } from "react";
import { useNavigate } from "react-router";
import { UserNotification } from "../../../declarations/tswaanda_backend/tswaanda_backend.did";
import { formatDate } from "../../../utils/time";

type Props = {
  notification: UserNotification;
  handleCloseNotification: () => void;
};

const Notification: FC<Props> = ({ notification, handleCloseNotification }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/notifications");
    handleCloseNotification();
  };

  const renderContent = () => {
    if ("KYCUpdate" in notification.notification) {
      return (
        <div className="ms-3 text-sm font-normal">
          <div className="text-sm font-semibold text-primary">KYC Update</div>
          <div className="text-sm text-gray-500 font-normal">
            {notification.notification.KYCUpdate.status}
          </div>
          <span className="text-xs font-medium text-gray-400">
            {formatDate(Number(notification.created))}
          </span>
        </div>
      );
    } else if ("NewProductDrop" in notification.notification) {
      return (
        <div className="ms-3 text-sm font-normal">
          <div className="text-sm font-semibold text-primary">
            New Product Drop
          </div>
          <div className="text-sm text-gray-500 font-normal">
            {notification.notification.NewProductDrop.productName}
          </div>
          <span className="text-xs font-medium text-gray-400">
            {formatDate(Number(notification.created))}
          </span>
        </div>
      );
    } else if ("OrderUpdate" in notification.notification) {
      let _notification = notification.notification.OrderUpdate;
      return (
        <div className="ms-3 text-sm font-normal">
          <div className="text-sm font-semibold text-primary">Order Update</div>
          <div className="text-sm text-gray-500 font-normal">
            {JSON.stringify(_notification.status) ===
              JSON.stringify({ fulfillment: null }) && "Delivered"}
            {JSON.stringify(_notification.status) ===
              JSON.stringify({ cancelled: null }) && "Cancelled"}
            {JSON.stringify(_notification.status) ===
              JSON.stringify({ shippment: null }) && "Shippment"}
            {JSON.stringify(_notification.status) ===
              JSON.stringify({ purchased: null }) && "Purchased"}
          </div>
          <span className="text-xs font-medium text-gray-400">
            {formatDate(Number(notification.created))}
          </span>
        </div>
      );
    }
  };
  return (
    <div
      onClick={handleRedirect}
      className="flex items-center text-sm hover:bg-green-200 p-2 rounded-md relative cursor-pointer"
    >
      {renderContent()}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
};

export default Notification;
