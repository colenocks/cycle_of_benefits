const cloudinary = require("cloudinary");
const multer = require("multer");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//using the diskStorage option instead of dest to have full control uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "dist/assets");
  },
  filename: function (req, file, cb) {
    // the null as first argument means no error
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploader = (file, folder) =>
  new Promise((resolve) => {
    console.log("uploader file: ", file);
    cloudinary.uploader.upload(
      file,
      (result) => {
        console.log("uploader: ", result);
        resolve({
          url: result.url,
          id: result.public_id,
        });
      },
      {
        resource_type: "auto",
        folder,
      }
    );
  });

const checkFileType = (file, cb) => {
  // Define the allowed extension
  let fileExts = ["png", "jpg", "jpeg", "gif"];

  // Check allowed extensions
  let isAllowedExt = fileExts.includes(
    file.originalname.split(".")[1].toLowerCase()
  );
  // Mime type must be an image
  let isAllowedMimeType = file.mimetype.startsWith("image/");

  if (isAllowedExt && isAllowedMimeType) {
    return cb(null, true); // no errors
  }
  cb("Error: File type not allowed!", false);
};

exports.upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MULTER_FILE_SIZE, 10),
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

//Image upload middleware
exports.cloudLink = async (file) => {
  try {
    // Upload file to cloudinary
    const uploadToCloudinary = async (path) => uploader(path, "cyob_images");

    const result = await uploadToCloudinary(file.path);
    return result;
  } catch (error) {
    return {
      status: "Request failed",
      error,
    };
  } finally {
    const file_path = path.join(__dirname, "..", file.path);
    fs.unlink(file_path, () => {
      console.log(file_path, " file path deleted");
    });
  }
};
