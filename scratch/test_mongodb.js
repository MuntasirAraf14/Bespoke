import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

async function testMongo() {
    try {
        console.log("Testing MongoDB with URI:", process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@'));
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB Connection Successful!");
        await mongoose.disconnect();
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
    }
}

testMongo();
