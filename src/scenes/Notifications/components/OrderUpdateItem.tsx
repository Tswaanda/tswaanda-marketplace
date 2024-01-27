import { FC } from "react";
import {
  UserNotification,
  UserOrderUpdateNotification,
} from "../../../declarations/tswaanda_backend/tswaanda_backend.did";
import { formatDate } from "../../../utils/time";

type Props = {
  _notification: UserOrderUpdateNotification;
  localNotification: UserNotification;
};
const OrderUpdateItem: FC<Props> = ({ _notification, localNotification }) => {
  return (
    <div>
      <h1 className="text-sm font-semibold text-gray-800">Order Update</h1>
      <div className="flex justify-between items-center">
        <h3 className="text-gray-400">
          {JSON.stringify(_notification.status) ===
            JSON.stringify({ fulfillment: null }) && "Delivered"}
          {JSON.stringify(_notification.status) ===
            JSON.stringify({ cancelled: null }) && "Cancelled"}
          {JSON.stringify(_notification.status) ===
            JSON.stringify({ shippment: null }) && "Shippment"}
          {JSON.stringify(_notification.status) ===
            JSON.stringify({ purchased: null }) && "Purchased"}
        </h3>
        <span className="mt-1 text-sm text-gray-600 line-clamp-2 text-end">
          {formatDate(Number(localNotification.created))}
        </span>
      </div>

      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
        {_notification.message}
      </p>
    </div>
  );
};

export default OrderUpdateItem;
