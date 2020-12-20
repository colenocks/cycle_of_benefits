const multer = require("multer");
const path = require("path");
const Datauri = require("datauri");

// const dUri = new Datauri();

const memory_storage = multer.memoryStorage();
/* OR */
const disk_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "dist/assets");
  },
  filename: function (req, file, cb) {
    // the null as first argument means no error
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const multerUploads = multer({
  storage: disk_storage,
  //   limits: {
  //     fileSize: parseInt(process.env.MULTER_FILE_SIZE, 10),
  //   },
  //   fileFilter: function (req, file, cb) {
  //     checkFileType(file, cb);
  //   },
});

/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 */
const dataUri = (req) =>
  dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

/**
 * @description This function filters image files with the correct mimeType and allowed exts
 * @param {String} file - containing the image file
 * @param {Function} callback - called to return false if filetype is incorrect and true otherwise
 */
const checkFileType = (file, callback) => {
  let fileExts = ["png", "jpg", "jpeg", "gif"];
  let isAllowedExt = fileExts.includes(
    file.originalname.split(".")[1].toLowerCase()
  );
  let isAllowedMimeType = file.mimetype.startsWith("image/");

  if (isAllowedExt && isAllowedMimeType) {
    return callback(null, true); // no errors
  }
  callback("Error: File type not allowed!", false);
};

module.exports = { multerUploads, dataUri };

/* 
      when we deploy our application to Heroku, we may not have the adminitrative privileges to write files to the remote computer which may crash our entire application.
      So, multer.memoeryStorage() tells multer that we’ll save the file to memory first which can be manipulated to the suit any purpose.
*/
