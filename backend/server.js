<<<<<<< HEAD
=======

>>>>>>> d5e31a6 (Prepare project for Github: README and LICENSE)
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
<<<<<<< HEAD

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

=======
import connectMongoDB from "./db/connectMongoDB.js";

// Load .env BEFORE anything else.
// Try default lookup first, then fall back to `backend/.env` so the dev script
// works whether npm is run from the project root or the backend folder.
const loaded = dotenv.config();
if (!process.env.MONGO_URI) {
	// fallback to backend/.env (useful when npm is executed from project root)
	const fallbackEnv = path.resolve(process.cwd(), "backend", ".env");
	dotenv.config({ path: fallbackEnv });
}
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

// Configure Cloudinary
>>>>>>> d5e31a6 (Prepare project for Github: README and LICENSE)
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

<<<<<<< HEAD
app.use(express.json({ limit: "5mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

app.use(cookieParser());

=======
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
>>>>>>> d5e31a6 (Prepare project for Github: README and LICENSE)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
<<<<<<< HEAD

=======
>>>>>>> d5e31a6 (Prepare project for Github: README and LICENSE)
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

<<<<<<< HEAD
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
=======
// ✅ Connect to MongoDB before starting server
connectMongoDB().then(() => {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> d5e31a6 (Prepare project for Github: README and LICENSE)
});
