import { body, param } from "express-validator";
import { AvailablePermissions } from "../../constants.js";

export const createRoleValidator = () => {
  return [
    body("role_name").trim().notEmpty().withMessage("Role is required"),
    body("permissions")
      .notEmpty()
      .withMessage("Permissions is required")
      .isArray({ min: 1 })
      .withMessage("At least one permission must be present."),
  ];
};
