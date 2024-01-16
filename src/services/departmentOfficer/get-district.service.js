import db from "../../utils/db.js";
export default {
    async findByDistrictName(entity) {
        const result = await db("district").where({ name: entity }).select("districtId").first();
        return result ? result.districtId : null;
    }
};
