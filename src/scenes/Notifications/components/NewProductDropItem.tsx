import { FC } from "react";
import {
  UserNewProductDropNotification,
  UserNotification,
} from "../../../declarations/tswaanda_backend/tswaanda_backend.did";
import { formatDate } from "../../../utils/time";

type Props = {
  _notification: UserNewProductDropNotification;
  localNotification: UserNotification;
};
const NewProductDropItem: FC<Props> = ({
  _notification,
  localNotification,
}) => {
  return (
    <div>
      <h1 className="text-sm font-semibold text-gray-800">New Product Drop</h1>
      <div className="flex items-center justify-start gap-3">
        <img
          src={
            "https://72ycx-4qaaa-aaaal-qcana-cai.raw.icp0.io/asset/bd2506f6-eab-32f-6a8-038c54d39b42"
          }
          className="w-[50px] h-[50px] flex-shrink-0"
          alt="product image"
        />
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-400">{_notification.productName}</h3>
            <span className="mt-1 text-sm text-gray-600 line-clamp-2 text-end">
              {formatDate(Number(localNotification.created))}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            New product drop {_notification.productName} is now available on the
            marketplace. You can view the product{" "}
            <a className="text-green-600" href={_notification.link}>
              here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewProductDropItem;
