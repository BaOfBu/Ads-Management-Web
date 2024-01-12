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
    findAllAdLocationByWardId(wardId){
        return db('ads_location').where('WardId', wardId);
    },
    findAllAdsLocationByWardId(wardId){
        return db('ads_location').select(
            'ads_location.*',
            'ads_type.name as ads_type_name',
            'image.imgLink as image_link',
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
        'image.imgLink as image_link',
      )
      .join('ads_panel_type', 'ads_panel.adsPanelTypeId', '=', 'ads_panel_type.adsPanelTypeId')
      .join('image', 'ads_panel.imgId', '=', 'image.imgId').where('ads_panel.adsLocationId', id).orderBy('ads_panel.adsPanelId');
    },
    findAdsPanel(adsPanelId){
      return db('ads_panel').select(
        'ads_panel.*',
        'ads_panel_type.name as ads_panel_type_name',
        'image.imgLink as image_link',
      )
      .join('ads_panel_type', 'ads_panel.adsPanelTypeId', '=', 'ads_panel_type.adsPanelTypeId')
      .join('image', 'ads_panel.imgId', '=', 'image.imgId').where('ads_panel.adsPanelId', adsPanelId).first();
    }
}
