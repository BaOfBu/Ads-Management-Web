import db from '../../utils/db.js';

export default {
    findAll() {
      return db('ward');
    },
    findDistrictByDistrictId(districtId){
      return db('district').where('districtId', districtId).first();
    },
    findWardByWardId(wardId){
      return db('ward').where('wardId', wardId).first();
    },
    findAdsLocationName(adsLocationId){
      return db('ads_location').select(
        'ads_location.location',
      )
      .where('ads_location.adsLocationId', adsLocationId).first();
    },
    findAdsLocation(adsLocationId){
      return db('ads_location').select(
        'ads_location.*',
        'ads_type.name as ads_type_name',
        'location_type.name as location_type_name',
        'ward.name as ward_name'
      )
      .join('ads_type', 'ads_location.adsType', '=', 'ads_type.adsTypeId')
      .join('image', 'ads_location.imgId', '=', 'image.imgId')
      .join('location_type', 'ads_location.locationType', '=', 'location_type.locationTypeId')
      .join('ward', 'ads_location.wardId', '=', 'ward.wardId').where('ads_location.adsLocationId', adsLocationId).first();
    },
    findAllAdLocationByWardId(wardId){
        return db('ads_location').where('WardId', wardId);
    },
    findAllAdsLocationByWardId(wardId){
        return db('ads_location').select(
            'ads_location.*',
            'ads_type.name as ads_type_name',
            'location_type.name as location_type_name',
            'ward.name as ward_name'
          )
          .join('ads_type', 'ads_location.adsType', '=', 'ads_type.adsTypeId')
          .join('image', 'ads_location.imgId', '=', 'image.imgId')
          .join('location_type', 'ads_location.locationType', '=', 'location_type.locationTypeId')
          .join('ward', 'ads_location.wardId', '=', 'ward.wardId').where('ads_location.wardId', wardId).orderBy('ward_name');
    },
    findAllAdsPanelByAdsLocationId(id){
      return db('ads_panel').select(
        'ads_panel.*',
        'ads_panel_type.name as ads_panel_type_name',
      )
      .join('ads_panel_type', 'ads_panel.adsPanelTypeId', '=', 'ads_panel_type.adsPanelTypeId')
      .where('ads_panel.adsLocationId', id).orderBy('ads_panel.adsPanelId');
    },
    findAdsPanel(adsPanelId){
      return db('ads_panel').select(
        'ads_panel.*',
        'ads_panel_type.name as ads_panel_type_name',
      )
      .join('ads_panel_type', 'ads_panel.adsPanelTypeId', '=', 'ads_panel_type.adsPanelTypeId')
      .where('ads_panel.adsPanelId', adsPanelId).first();
    },
    findLicenseRequestOfAdsPanel(adsPanelId){
      return db('ads_panel').select(
        'ads_panel.*',
        'ads_location.location as ads_location_name',
        'ads_panel_type.name as ads_panel_type_name',
        'image.imgLink as img_link',
        'license_request.content as content',
        'license_request.nameCompany as nameCompany',
        'license_request.phoneCompany as phoneCompany',
        'license_request.emailCompany as emailCompany',
        'license_request.locationCompany as locationCompany',
        'license_request.startDate as startDate',
        'license_request.endDate as endDate',
        'license_request.status as status',
      )
      .leftJoin('ads_location', 'ads_panel.adsLocationId', 'ads_location.adsLocationId')
      .leftJoin('ads_panel_type', 'ads_panel.adsPanelTypeId', 'ads_panel_type.adsPanelTypeId')
      .leftJoin('license_request', 'ads_panel.licenseId', 'license_request.licenseRequestId')
      .leftJoin('image', 'license_request.imgId', 'image.imgId')
      .where('ads_panel.adsPanelId', adsPanelId).first();
    },
    findAllLocationTypeName(){
      return db('location_type');
    },
    findAllAdsTypeName(){
      return db('ads_type');
    },
    findAllAdsPanelType(){
      return db('ads_panel_type');
    },
    async saveImage(entity) {
      const [insertedId] = await db("image").insert({
          imgLink: entity
      });
      return insertedId;
    },
    async createAdsLocationEdit(entity){
      const insertedId = await db("edit_ads_location_request").insert({
        AdsLocationId: entity.AdsLocationId,
        AdsLocationTypeId : entity.AdsLocationTypeId,
        AdsTypeId : entity.AdsTypeId,
        ImgId : entity.ImgId,
        RequestReason : entity.RequestReason,
        WardId : entity.WardId,
        Status: entity.status,
        RequestTime: entity.RequestTime,
        districtId: entity.districtId,
      });
      return insertedId;
    },
    findAdsLocationRaw(adsLocationId){
      return db('ads_location').where('adsLocationId', adsLocationId).first();
    },
    async createAdsPanelEdit(entity){
      const insertedId = await db("edit_ads_panel_request").insert({
        AdsPanelId: entity.AdsPanelId,
        AdsLocationId: entity.AdsLocationId,
        AdsPanelTypeId : entity.AdsPanelTypeId,
        RequestReason : entity.RequestReason,
        WardId : entity.WardId,
        Status: entity.status,
        RequestTime: entity.RequestTime,
        DistrictId: entity.districtId,
        Height: entity.Height,
        Width: entity.Width,
        Quantity: entity.Quantity,
      });
      return insertedId;
    },
}
