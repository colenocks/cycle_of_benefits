exports.throwError = (msg, status, data = "") => {
  //errors are thrown when in a non async block
  const error = new Error(msg);
  error.statusCode = status;
  error.data = data;
  throw error;
};

exports.catchError = (err) => {
  //errors are passed into the next argument in an async block
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};
