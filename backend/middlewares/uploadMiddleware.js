import multer from "multer";
import path from "path";

// Set up storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in "uploads" folder
    },
    filename: (req, file, cb) => {
        console.log(file.originalname)
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Unique filename (timestamp + extension)
    },
    limits: { fileSize: 5 * 1024 * 1024, fieldSize: 1 * 1024 * 1024 } // 10MB limit
});

// File filter (only allow images)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

// Configure Multer middleware
export const upload = multer({ storage, fileFilter });
