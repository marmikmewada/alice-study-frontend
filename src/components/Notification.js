import React, { useState, useEffect } from "react";

const Notification = ({ type, message, onClose }) => {
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
      onClose();
    }, 3000); // Auto-close notification after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const getNotificationStyle = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 p-4 mb-4 mx-auto rounded-md shadow-md z-50 ${getNotificationStyle()} ${
        showNotification ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    >
      <div className="flex items-center justify-between">
        <p className="text-lg">{message}</p>
        <button
          onClick={() => {
            setShowNotification(false);
            onClose();
          }}
          className="text-white ml-4 focus:outline-none"
        >
          <svg
            className="w-4 h-4 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M18.364 5.636a2 2 0 0 0-2.828 0L12 9.172 8.464 5.636a2 2 0 1 0-2.828 2.828L9.172 12l-3.536 3.536a2 2 0 1 0 2.828 2.828L12 14.828l3.536 3.536a2 2 0 1 0 2.828-2.828L14.828 12l3.536-3.536a2 2 0 0 0 0-2.828z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;
