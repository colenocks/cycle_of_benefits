const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploads = (file, folder) =>
  new Promise(resolve => {
    cloudinary.uploader.upload(
      file,
      result => {
        resolve({
          url: result.url,
          id: result.public_id
        });
      },
      {
        resource_type: "auto",
        folder
      }
    );
  });

exports.checkFileType = (file, cb) => {
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
  } else {
    cb("Error: File type not allowed!");
  }
};
