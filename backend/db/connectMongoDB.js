import mongoose from "mongoose";

const connectMongoDB = async () => {
	try {
<<<<<<< HEAD
=======
		if (!process.env.MONGO_URI) {
			console.error("MONGO_URI is not set. Make sure .env exists in the project root or backend/.env and contains MONGO_URI.");
			process.exit(1);
		}
>>>>>>> d5e31a6 (Prepare project for Github: README and LICENSE)
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error connection to mongoDB: ${error.message}`);
		process.exit(1);
	}
};

export default connectMongoDB;
