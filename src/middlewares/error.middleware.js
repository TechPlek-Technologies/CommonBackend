import mongoose from "mongoose";

import { ApiError } from "../utils/Error/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (error.status === 413) {
    // return res.status(413).json({ error: "Payload Too Large" });
    error = new ApiError(413, "Payload Too Large");
  }

  // Check if the error is an instance of an ApiError class which extends native Error class
  if (!(error instanceof ApiError)) {
    // assign an appropriate status code
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    // set a message from native Error instance or a custom one
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Now we are sure that the `error` variable will be an instance of ApiError class
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV?.toLowerCase() === "development"
      ? { stack: error.stack }
      : {}), // Error stack traces should be visible in development for debugging
  };

  // POINT : Error Stack will be printed on console when "development"
  process.env.NODE_ENV === "development" &&
    console.log("🔴🔴🔴 Error Stack 🔴🔴🔴\n", error.stack);

  // Send error response
  return res.status(error.statusCode).json(response);
};

export { errorHandler };
