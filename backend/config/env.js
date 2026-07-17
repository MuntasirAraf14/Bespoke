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

const productionRequiredEnvs = [
    'ALLOWED_ORIGINS',
    'BACKEND_URL',
    'FRONTEND_URL',
    'GOOGLE_CLIENT_ID',
];

export const validateEnv = () => {
    const required = process.env.NODE_ENV === 'production'
        ? [...requiredEnvs, ...productionRequiredEnvs]
        : requiredEnvs;
    const missing = required.filter(env => !process.env[env]);
    if (missing.length > 0) {
        console.error('CRITICAL: Missing required environment variables:', missing.join(', '));
        process.exit(1);
    }
    console.log('Environment variables validated.');
};
