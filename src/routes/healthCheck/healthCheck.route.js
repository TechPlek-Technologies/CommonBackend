import { Router } from "express";
import { healthCheck } from "../../controllers/healthCheck/healthCheck.controller.js";

const router = Router();

router.get("/", healthCheck);

export default router;
