import express from "express";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Route to get the logged-in user's information
router.get("/me", protectRoute, getMe);

// Route for user signup
router.post("/signup", signup); // No changes needed

// Route for user login
router.post("/login", login);

// Route for user logout
router.post("/logout", protectRoute, logout); // It's good practice to protect the logout route

export default router;