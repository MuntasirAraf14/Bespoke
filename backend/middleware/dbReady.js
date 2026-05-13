import mongoose from "mongoose";
import { sendError } from "../utils/http.js";

const dbReady = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return sendError(res, 503, "Database unavailable. Check MONGODB_URI and network access.");
    }

    next();
};

export default dbReady;
