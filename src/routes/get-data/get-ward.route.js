import express from "express";
import getWardService from "../../services/departmentOfficer/get-ward.service.js";
import getDistrictService from "../../services/departmentOfficer/get-district.service.js";
const router = express.Router();
// [GET]/get-data/get-ward
router.use("/", async function (req, res) {
    res.json(await getWardService.findByWardName());
});
export default router;
