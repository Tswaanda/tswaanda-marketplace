import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/ContextWrapper";
import { UserNotification } from "../../declarations/tswaanda_backend/tswaanda_backend.did";
import NotificationAccordion from "./components/NotificationAccordion";

export default function Notifications() {
  const {adminBackendActor, wsMessage } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[] | null>(null);

  useEffect(() => {
    if (wsMessage) {
      getNotifications();
    }
  }, [wsMessage]);

  useEffect(() => {
    if (adminBackendActor) {
      getNotifications();
    }
  }, [adminBackendActor]);


  const getNotifications = async () => {
    try {
      const res = await adminBackendActor.getUserNotifications();
    setNotifications(res);
    } catch (error) {
      console.log("Error getting notifications", error)
    }
  };

  console.log("Notifications: ", notifications);

  return (
    <div>
      <div className="mt-6 flow-root">
        <ul role="list" className="-my-5 divide-y divide-gray-200">
          {notifications?.map((notification) => (
            <li key={notification.id} className="">
             <NotificationAccordion {...{notification}} />
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <a
          href="#"
          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          View all
        </a>
      </div>
    </div>
  );
}
