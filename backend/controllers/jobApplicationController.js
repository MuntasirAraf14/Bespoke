import jobApplicationModel from "../models/jobApplicationModel.js";
import { sendError, sendSuccess } from "../utils/http.js";

const VALID_STATUSES = ["New", "Reviewed", "Shortlisted", "Rejected"];

const submitApplication = async (req, res) => {
    try {
        const { role, name, email, phone, portfolio = "", message } = req.body;

        if (!role || !name || !email || !phone || !message) {
            return sendError(res, 400, "Role, name, email, phone, and message are required");
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return sendError(res, 400, "Please provide a valid email address");
        }

        const application = new jobApplicationModel({
            role,
            name,
            email,
            phone,
            portfolio,
            message,
            date: Date.now(),
        });

        await application.save();
        sendSuccess(res, { message: "Application submitted successfully" });
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
};

const listApplications = async (req, res) => {
    try {
        const applications = await jobApplicationModel.find({}).sort({ date: -1 });
        sendSuccess(res, { applications });
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId, status } = req.body;

        if (!applicationId || !VALID_STATUSES.includes(status)) {
            return sendError(res, 400, "Valid application ID and status are required");
        }

        const application = await jobApplicationModel.findByIdAndUpdate(
            applicationId,
            { status },
            { new: true }
        );

        if (!application) {
            return sendError(res, 404, "Application not found");
        }

        sendSuccess(res, { message: "Application status updated", application });
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
};

const removeApplication = async (req, res) => {
    try {
        const { applicationId } = req.body;

        if (!applicationId) {
            return sendError(res, 400, "Application ID is required");
        }

        const application = await jobApplicationModel.findByIdAndDelete(applicationId);

        if (!application) {
            return sendError(res, 404, "Application not found");
        }

        sendSuccess(res, { message: "Application removed" });
    } catch (error) {
        console.log(error);
        sendError(res, 500, error.message);
    }
};

export {
    submitApplication,
    listApplications,
    updateApplicationStatus,
    removeApplication,
};
