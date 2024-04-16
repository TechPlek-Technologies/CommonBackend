import { validationResult } from "express-validator";
import { ApiError } from "../utils/Error/ApiError.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  // POINT : Show all errors
  // errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  // POINT : Please highlight the initial error that occurred when multiple errors were encountered for a single field.
  errors
    .array({ onlyFirstError: true })
    .map((err) => extractedErrors.push({ [err.path]: err.msg }));

  // 422: Unprocessable Entity
  throw new ApiError(422, "Received data is not valid", extractedErrors);
};
