import { Router } from "express";
import {
  register,
  login,
  assignRoleToUser,
  getAllUsers,
  getCurrentUser,
  logout,
  refreshAccessToken,
} from "../../controllers/users/users.controller.js";
import {
  loginValidator,
  registerValidator,
} from "../../validators/users/users.validator.js";
import { validate } from "../../validators/validate.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(registerValidator(), validate, register);

router.route("/login").post(loginValidator(), validate, login);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/assignRoleToUser").patch(assignRoleToUser);
// PROTECTED : MUST LOGIN
router.route("/").get(verifyJWT, getAllUsers);

router.route("/currentUser").get(verifyJWT, getCurrentUser);

router.route("/logout").post(verifyJWT, logout);

export default router;
