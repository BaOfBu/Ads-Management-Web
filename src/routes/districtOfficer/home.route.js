import express from "express";
import homeController from "../../controllers/districtOfficer/home.controller.js";
const router = express.Router();

router.get("/", homeController.index)
export default router;
