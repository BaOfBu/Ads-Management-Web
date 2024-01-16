import express from "express";
import getDistrictService from "../../services/departmentOfficer/get-district.service.js";
const router = express.Router();
// [GET]/get-data/get-district
router.use("/", async function (req, res) {
    res.json(await getDistrictService.findByDistrictName());
});
export default router;
