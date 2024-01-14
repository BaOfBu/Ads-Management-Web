import express from "express";
import CitizenController from "../../controllers/citizen/citizen.controller.js";
const router = express.Router();
function setDefaultLayoutAndPartials(req, res, next) {
    res.locals.layout = "citizen/layouts/main";
    next();
}
router.use(setDefaultLayoutAndPartials);

router.get("/", CitizenController.index);
router.get("/report", CitizenController.report);

export default router;
