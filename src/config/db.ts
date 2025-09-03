import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI as string;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }
    await mongoose.connect(uri);
    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
