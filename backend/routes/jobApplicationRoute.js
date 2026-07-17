import express from "express";
import {
    submitApplication,
    listApplications,
    updateApplicationStatus,
    removeApplication,
} from "../controllers/jobApplicationController.js";
import adminAuth from "../middleware/adminAuth.js";
import dbReady from "../middleware/dbReady.js";

const jobApplicationRouter = express.Router();

jobApplicationRouter.post("/apply", dbReady, submitApplication);
jobApplicationRouter.post("/list", adminAuth, dbReady, listApplications);
jobApplicationRouter.post("/status", adminAuth, dbReady, updateApplicationStatus);
jobApplicationRouter.post("/remove", adminAuth, dbReady, removeApplication);

export default jobApplicationRouter;
