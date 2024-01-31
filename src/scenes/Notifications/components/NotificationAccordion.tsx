import { FC, useState } from "react";
import { UserNotification } from "../../../declarations/tswaanda_backend/tswaanda_backend.did";
import KYCUpdateItem from "./KYCUpdateItem";
import NewProductDropItem from "./NewProductDropItem";
import OrderUpdateItem from "./OrderUpdateItem";
import { useAuth } from "../../../hooks/ContextWrapper";

type Props = {
  notification: UserNotification;
};
const NotificationAccordion: FC<Props> = ({ notification }) => {
  const { adminBackendActor, setUpdateNotifications } = useAuth();
  const [localNotification, setLocalNotification] = useState(notification);

  const markAsRead = async () => {
    setLocalNotification({ ...localNotification, read: true });
    try {
      await adminBackendActor?.markUserNotificationAsRead(notification.id);
      setUpdateNotifications(true);
    } catch (error) {
      console.log("Error marking notification as read", error);
    }
  };

  const renderContent = () => {
    if ("KYCUpdate" in localNotification.notification) {
      let _notification = localNotification.notification.KYCUpdate;
      return <KYCUpdateItem {...{ _notification, localNotification }} />;
    } else if ("NewProductDrop" in localNotification.notification) {
      let _notification = localNotification.notification.NewProductDrop;
      return <NewProductDropItem {...{ _notification, localNotification }} />;
    } else if ("OrderUpdate" in localNotification.notification) {
      let _notification = localNotification.notification.OrderUpdate;
      return <OrderUpdateItem {...{ _notification, localNotification }} />;
    }
  };
  return (
    <div
      onClick={markAsRead}
      className={`${
        localNotification.read ? "bg-white" : "bg-green-300 "
      } relative  px-4 py-2 rounded-lg`}
    >
      {renderContent()}
    </div>
  );
};

export default NotificationAccordion;
