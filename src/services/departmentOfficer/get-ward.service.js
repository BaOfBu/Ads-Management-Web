import db from "../../utils/db.js";
export default {
    async findByWardName(entity, district) {
        try {
            const result = await db("ward")
                .where({ "ward.name": entity, "ward.districtId": Number(district) })
                .select("ward.wardId")
                .first();
            return result ? result.wardId : null;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
};
