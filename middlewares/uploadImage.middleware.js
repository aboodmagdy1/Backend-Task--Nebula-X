const multer = require("multer");
const path = require("path");

// return multer upload instance
const multerOptions = () => {
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads")); // Save to the "uploads" directory
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
