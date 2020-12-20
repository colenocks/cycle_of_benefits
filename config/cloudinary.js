const { config, uploader } = require("cloudinary").v2;
const multer = require("multer");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudUploader = (file, folder) =>
  new Promise((resolve, reject) => {
    uploader.upload(
      file,
      {
        resource_type: "auto",
        folder,
      },
      (err, result) => {
        if (!err) {
          resolve({
            url: result.url,
            id: result.public_id,
          });
          return;
        }
        reject({ err });
      }
    );
  });

// Upload file to cloudinary
const uploadToCloudinary = async (path) => cloudUploader(path, "cyob_images");

//Image upload middleware
const cloudLink = async (file) => {
  try {
    const result = await uploadToCloudinary(file.path);
    return result;
  } catch (error) {
    return {
      status: "Request failed",
      error,
    };
  } finally {
    const file_path = path.join(__dirname, "..", file.path);
    fs.unlink(file_path, (err) => {
      if (!err) console.log(file_path, " file path deleted");
    });
  }
};

module.exports = { cloudLink };
