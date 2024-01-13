import db from "../../utils/db.js";
export default {
    async saveImage(entity) {
        const [insertedId] = await db("image").insert({
            imgLink: entity
        });
        return insertedId;
    }
};
