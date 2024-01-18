import express from "express";
import profileController from "../../controllers/wardOfficer/profile.controller.js";
const router = express.Router();

router.get("/", profileController.update);

export default router;