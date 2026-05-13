import dotenv from 'dotenv';
dotenv.config();

const requiredEnvs = [
    'MONGODB_URI',
    'JWT_SECRET',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'SSLCOMMERZ_STORE_ID',
    'SSLCOMMERZ_STORE_PASSWORD',
];

export const validateEnv = () => {
    const missing = requiredEnvs.filter(env => !process.env[env]);
    if (missing.length > 0) {
        console.error('CRITICAL: Missing required environment variables:', missing.join(', '));
        process.exit(1);
    }
    console.log('Environment variables validated.');
};
