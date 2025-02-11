import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
	try {
	  const userId = req.user._id;
	  const notifications = await Notification.find({ to: userId })
		.sort({ createdAt: -1 })
		.populate("from", "username profileImg")
		.populate("postId", "content image"); // Populate postId with image
  
	  await Notification.updateMany({ to: userId }, { read: true });
	  res.status(200).json(notifications);
	} catch (error) {
	  console.error("Error in getNotifications function", error.message);
	  res.status(500).json({ error: "Internal Server Error" });
	}
  };

// Additional controller methods...

// Create notification for "like", "follow", "comment"
export const createNotification = async (req, res) => {
  const { postId, type, toUserId } = req.body;
  const fromUserId = req.user._id;

  try {
    await Notification.create({
      from: fromUserId,
      to: toUserId,
      type,
      postId: type === "comment" || type === "like" ? postId : undefined,
    });

    res.status(201).json({ message: "Notification created" });
  } catch (error) {
    console.error("Error in createNotification function", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a single notification
export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.to.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not allowed to delete this notification" });
    }

    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNotification function", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete all notifications for the user
// Delete all notifications for the user
export const deleteAllNotifications = async (req, res) => {
	try {
	  const userId = req.user._id;
  
	  // Delete all notifications for the user
	  await Notification.deleteMany({ to: userId });
	  res.status(200).json({ message: "All notifications deleted successfully" });
	} catch (error) {
	  console.error("Error in deleteAllNotifications function", error.message);
	  res.status(500).json({ error: "Internal Server Error" });
	}
  };