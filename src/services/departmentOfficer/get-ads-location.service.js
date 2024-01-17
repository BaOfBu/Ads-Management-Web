import db from "../../utils/db.js";
export default {
    findAllAdsLocationBasic() {
        return db("ads_location")
            .select(
                "ads_location.*",
                "ads_type.name as ads_type_name",
                "location as location",
                "location_type.name as location_type_name",
                "status as status",
                "lat as lat",
                "long as long"
            )
            .join("ads_type", "ads_location.adsType", "=", "ads_type.adsTypeId")
            .join("location_type", "ads_location.locationType", "=", "location_type.locationTypeId");
    },
    findAllAdsLocationByWard(wardId) {
        console.log(wardId);
        return db("ads_location")
            .select(
                "ads_location.*",
                "ads_type.name as ads_type_name",
                "location as location",
                "location_type.name as location_type_name",
                "status as status",
                "lat as lat",
                "long as long"
            )
            .join("ads_type", "ads_location.adsType", "=", "ads_type.adsTypeId")
            .join("location_type", "ads_location.locationType", "=", "location_type.locationTypeId")
            .where("ads_location.wardId", "=", wardId);
    }
};
