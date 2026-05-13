import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './backend/.env' });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
    try {
        console.log("Testing Cloudinary with:");
        console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
        console.log("API Key:", process.env.CLOUDINARY_API_KEY);
        
        const result = await cloudinary.api.ping();
        console.log("Cloudinary Ping Result:", result);
    } catch (error) {
        console.error("Cloudinary Test Failed:", error);
    }
}

testUpload();
