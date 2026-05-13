import express from "express";
import cors from "cors";
import 'dotenv/config';
import { fileURLToPath } from "url";
import mongoose from "mongoose";

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});
import { validateEnv } from "./config/env.js";
import connectDB from './config/mongodb.js';
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRoute.js";
import cloudinary from "cloudinary";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

// App Config
const app = express();
const port = process.env.PORT || 4000;
let server;

// Async init
const init = async () => {
    try {
        validateEnv();
        const dbConnected = await connectDB();
        await connectCloudinary();
        console.log(dbConnected === false ? "Storage connected. Database unavailable." : "Database and Storage connections successful.");
        
        server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error("Critical initialization failure:", error);
        process.exit(1);
    }
};

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Strict CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4173', 'http://localhost:4174', 'http://127.0.0.1:4173', 'http://127.0.0.1:4174'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.trycloudflare.com')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(helmet());
app.use(compression());
app.use(morgan('combined')); // Production logging format

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
    res.send("API working");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        database: mongoose.connection.readyState === 1 ? "connected" : "unavailable",
        timestamp: new Date().toISOString()
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (isDirectRun) {
    init();
}

export { app, server, init };
