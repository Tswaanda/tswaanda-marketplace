import React from 'react'

const Notifications = ({handleCloseNotification}) => {

    const notifications = [
        { id: 1, name: "Alice Johnson", action: "inquired about your apple harvest", time: "10 minutes ago" },
        { id: 2, name: "Bob Smith", action: "placed an order for 20kg of potatoes", time: "1 hour ago" },
        { id: 3, name: "Carol White", action: "left a review on your dairy products", time: "2 hours ago" },
        { id: 4, name: "Dave Brown", action: "asked for a discount on maize", time: "yesterday" },
        // ... more notifications
    ];

    const recentNotifications = notifications.slice(0, 4);

return (
    <div id="toast-notification" className={`absolute top-0 right-0 w-96 max-w-xs p-4 mt-20 text-gray-900 bg-white rounded-lg shadow dark:bg-primary dark:text-gray-300`} role="alert">
        <div className="flex items-center mb-3">
            <span className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">New notification</span>
            <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-primary dark:hover:bg-secondary" data-dismiss-target="#toast-notification" aria-label="Close" onClick={handleCloseNotification}>
                <span className="sr-only">Close</span>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
            </button>
        </div>
        <div >
            {recentNotifications.map(notification => (
                <div key={notification.id} className="flex items-center text-sm hover:bg-green-300 p-2 rounded-md relative cursor-pointer">
                    <div className="ms-3 text-sm font-normal">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{notification.name}</div>
                        <div className="text-sm font-normal">{notification.action}</div>
                        <span className="text-xs font-medium text-yellow-500">{notification.time}</span>
                    </div>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
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
