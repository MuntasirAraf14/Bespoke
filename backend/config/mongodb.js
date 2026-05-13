// ./config/mongodb.js

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS) || 10000,
        });
        console.log("MongoDB Connected");
        return true;
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        if (process.env.ALLOW_DB_FAILURE === 'true') {
            console.warn("Starting without MongoDB because ALLOW_DB_FAILURE=true.");
            return false;
        }
        process.exit(1);
    }
}

export default connectDB;
