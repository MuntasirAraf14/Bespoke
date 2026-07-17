import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
    role: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    portfolio: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    status: {
        type: String,
        enum: ["New", "Reviewed", "Shortlisted", "Rejected"],
        default: "New",
    },
    date: { type: Number, required: true },
});

jobApplicationSchema.index({ status: 1, date: -1 });

const jobApplicationModel =
    mongoose.models.jobApplication ||
    mongoose.model("jobApplication", jobApplicationSchema);

export default jobApplicationModel;
