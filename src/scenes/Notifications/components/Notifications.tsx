import React, { FC } from 'react'
import { Link } from 'react-router-dom';
import Notification from './Notification';
import { UserNotification } from '../../../declarations/tswaanda_backend/tswaanda_backend.did';

type Props = {
    handleCloseNotification: () => void;
    userNotifications: UserNotification[];
}

const Notifications: FC<Props> = ({handleCloseNotification, userNotifications}) => {

   

    const recentNotifications = userNotifications.slice(0, 5);

return (
    <div id="toast-notification" className={`absolute top-0 right-0 w-96 max-w-xs p-4 mt-20 text-gray-900 bg-white rounded-lg shadow dark:text-gray-300 border`} role="alert">
        <div className="flex items-center mb-3">
            <span className="mb-1 text-sm font-semibold text-gray-900 ">New notification</span>
            <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:hover:bg-secondary" data-dismiss-target="#toast-notification" aria-label="Close" onClick={handleCloseNotification}>
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        </div>
        <div >
            {recentNotifications.map(notification => (
               <Notification key={notification.id} {...{notification, handleCloseNotification}} />
            ))}
        </div>

        <div className="text-right">
            <a href="/notifications" className="text-sm text-yellow-500 hover:text-white hover:underline cursor-pointer">
                View All
            </a>
        </div>
    </div>
);
};

export default Notifications;
