import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getNotifications,
  deleteNotification,
  createNotification,
  deleteAllNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.post("/", protectRoute, createNotification); // To create notifications for like/follow/comment
router.delete("/:id", protectRoute, deleteNotification); // Delete a single notification
router.delete("/", protectRoute, deleteAllNotifications); // Delete all notifications

export default router;