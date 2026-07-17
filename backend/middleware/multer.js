import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/";
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        // Now we are sure the directory exists
        callback(null, uploadDir);
    },
    filename: function (req, file, callback) {
        const extension = path.extname(file.originalname).toLowerCase();
        const safeBaseName = path
            .basename(file.originalname, extension)
            .replace(/[^a-z0-9_-]/gi, "-")
            .slice(0, 60);
        const uniqueName = `${Date.now()}-${safeBaseName}${extension}`;
        callback(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 4,
        fields: 20,
    },
    fileFilter: (req, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return callback(new Error("Only image uploads are allowed"));
        }
        callback(null, true);
    },
});

export default upload;
