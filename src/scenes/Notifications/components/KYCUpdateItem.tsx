import React, { FC } from "react";
import {
  UserKYCUpdateNotification,
  UserNotification,
} from "../../../declarations/tswaanda_backend/tswaanda_backend.did";
import { formatDate } from "../../../utils/time";

type Props = {
  _notification: UserKYCUpdateNotification;
  localNotification: UserNotification;
};
const KYCUpdateItem: FC<Props> = ({ _notification, localNotification }) => {
  return (
    <div>
      <h1 className="text-sm font-semibold text-gray-800">KYC Update</h1>
      <div className="flex justify-between items-center">
        <h3 className="text-gray-400">{_notification.status}</h3>
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

export default KYCUpdateItem;
