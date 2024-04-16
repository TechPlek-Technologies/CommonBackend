import { body, param } from "express-validator";

export const addCompanyValidator = () => {
  return [
    body("company_name")
      .trim()
      .notEmpty()
      .withMessage("Company name is required"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};
