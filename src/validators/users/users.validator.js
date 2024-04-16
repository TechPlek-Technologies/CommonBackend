import { body, param } from "express-validator";

export const registerValidator = () => {
  return [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("role")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Role is required")
      .isMongoId()
      .withMessage("Invalid role : role must be mongooseId"),
  ];
};

export const loginValidator = () => {
  return [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
};
