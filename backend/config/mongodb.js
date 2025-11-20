// ./config/mongodb.js

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // --- ADD THIS DEBUG LOG ---
        console.log('>>> [mongodb.js] Attempting to connect with URI:', process.env.MONGODB_URI);
        // -------------------------

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
}

export default connectDB;