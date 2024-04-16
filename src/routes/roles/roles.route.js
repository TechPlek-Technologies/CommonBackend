import { Router } from "express";
import { createRole } from "../../controllers/roles/roles.controller.js";
import { createRoleValidator } from "../../validators/roles/roles.validator.js";
import { validate } from "../../validators/validate.js";

const router = Router();

/**
 * @body {String} role_name (case insensitive)
 * @body {Array} permissions (case sensitive)
 */
router.route("/").post(createRoleValidator(), validate, createRole);

export default router;
