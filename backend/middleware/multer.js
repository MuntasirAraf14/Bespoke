import multer from "multer";
import path from "path"; // Import the path module
import fs from "fs"; // Import the file system module

// Define the upload directory
const uploadDir = "uploads/";

// Check if the directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        // Now we are sure the directory exists
        callback(null, uploadDir);
    },
    filename: function (req, file, callback) {
        const uniqueName = Date.now() + "-" + file.originalname;
        callback(null, uniqueName);
    }
});

const upload = multer({ storage });

export default upload;