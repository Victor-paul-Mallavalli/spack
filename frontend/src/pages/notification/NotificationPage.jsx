import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons"; // Importing the trash icon
import { IoSettingsOutline } from "react-icons/io5"; // Importing the settings icon
import { formatDistanceToNow } from 'date-fns'; // Importing date-fns for time formatting

import LoadingSpinner from "../../components/common/LoadingSpinner";

const NotificationPage = () => {
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  // Mutation for deleting a single notification
  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (notificationId) => {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Notification deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutation for deleting all notifications
  const { mutate: deleteAllNotifications } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("All notifications deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Delete individual notification without confirmation
  const handleDeleteNotification = (notificationId) => {
    deleteNotification(notificationId); // Directly delete the notification
  };

  const handleDeleteAllNotifications = () => {
    deleteAllNotifications(); // Delete all notifications without prompt
  };

  return (
    <>
      <style>
        {`
          .notifications-container {
              background-color: #f4f4f4;
              padding: 20px;
              width: 100vw;
              box-sizing: border-box;
          }
          .notifications-header {
              font-size: 1.5rem;
              font-weight: bold;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
          }
          .loading-spinner {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100px;
          }
          .no-notifications {
              text-align: center;
              font-weight: bold;
              padding: 20px;
          }
          .notification-item {
              background-color: #fff;
              border-radius: 12px;
              padding: 20px;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              transition: background-color 0.3s ease;
          }
          .notification-item.unread {
              background-color: #e0f2ff;
          }
          .notification-content {
              display: flex;
              align-items: center;
              flex: 1;
          }
          .notification-avatar img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              margin-right: 20px;
          }
          .notification-text {
              display: flex;
              flex-direction: column;
          }
          .notification-user {
              font-weight: bold;
              font-size: 1.2rem;
              margin-right: 5px;
          }
          .notification-action {
              font-size: 1.1rem;
              margin-top: 3px;
              color: #333;
          }
          .notification-time {
              font-size: 0.9rem;
              color: #888;
              margin-top: 5px;
          }
          .notification-delete {
              cursor: pointer;
              margin-left: 20px;
              color: #888;
              transition: color 0.3s ease;
          }
          .notification-delete:hover {
              color: #f44336;
          }
          .delete-all {
              cursor: pointer;
              color: #f44336;
              font-weight: bold;
              margin-left: 10px;
              display: flex;
              align-items: center;
          }
          .delete-all:hover {
              color: #d32f2f;
          }
        `}
      </style>

      <div className="notifications-container">
        <div className="notifications-header">
          <p>Notifications</p>
          <div className="delete-all" onClick={handleDeleteAllNotifications}>
            <IoSettingsOutline size={24} />
          </div>
        </div>

        {isLoading && (
          <div className="loading-spinner">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {notifications?.length === 0 && (
          <div className="no-notifications">No notifications 🤔</div>
        )}

        {notifications?.map((notification) => (
          <div
            className={`notification-item ${notification.read ? "" : "unread"}`} 
            key={notification._id}
          >
            <div className="notification-content">
              <div className="notification-avatar">
                {/* Display the liked post image if it's a "like" notification */}
                {notification.type === "like" && notification.postId?.image ? (
                  <img
                    src={notification.postId.image}
                    alt="Liked Post Image"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                ) : (
                  <Link to={`/profile/${notification.from.username}`} className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={notification.from.profileImg || "/avatar-placeholder.png"}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </Link>
                )}
              </div>

              <div className="notification-text">
                <Link to={`/profile/${notification.from.username}`}>
                  <span className="notification-user">
                    @{notification.from.username}
                  </span>
                </Link>
                <span className="notification-action">
                  {notification.type === "follow"
                    ? "followed you"
                    : notification.type === "like"
                    ? "liked your post"
                    : notification.type === "comment"
                    ? "commented on your post"
                    : ""}
                </span>

                {/* Display the time ago using date-fns */}
                <span className="notification-time">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            <div
              className="notification-delete"
              onClick={() => handleDeleteNotification(notification._id)} // Delete without confirmation
            >
              <FontAwesomeIcon icon={faTrash} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationPage;
