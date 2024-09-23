const fs = require("fs");
const path = require("path");
const multer = require("multer");

// return multer upload instance
const multerOptions = () => {
  const uploadDir = path.join(__dirname, "../uploads");

  // Check if 'uploads' directory exists, if not, create it
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir); // Save to the "uploads" directory
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `product-${Date.now()}${ext}`;
      cb(null, filename);
    },
  });

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("not allawed image type "), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

//multer configuration
exports.uploadSingleImage = (fieldname) => multerOptions().single(fieldname);
