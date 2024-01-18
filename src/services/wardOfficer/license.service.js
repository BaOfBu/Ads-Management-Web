import db from '../../utils/db.js';

export default {
  findAll() {
    return db('license_request').select(
        'license_request.*',
        'ads_location.location as ads_location_name',
        'location_type.name as ads_location_type_name',
        'ads_panel_type.name as ads_panel_type_name',
        'ads_type.name as ads_type_name',
        'ads_panel.width as width',
        'ads_panel.height as height',
        'ward.name as ward_name',
        'district.name as district_name',
        'image.imgLink as img_link'
      )
      .leftJoin('ads_location', 'license_request.adsLocationId', 'ads_location.adsLocationId')
      .leftJoin('location_type', 'ads_location.locationType', 'location_type.locationTypeId')
      .leftJoin('ads_type', 'ads_location.adsType', 'ads_type.adsTypeId')
      .leftJoin('ads_panel', 'license_request.adsPanelId', 'ads_panel.adsPanelId')
      .leftJoin('ads_panel_type', 'ads_panel.adsPanelTypeId', 'ads_panel_type.adsPanelTypeId')
      .leftJoin('ward', 'license_request.wardId', 'ward.wardId')
      .leftJoin('district', 'license_request.districtId', 'district.districtId')
      .leftJoin('image', 'license_request.imgId', 'image.imgId')
      .orderBy('startDate');
  },
  findByWardId(wardId) {
    return db('license_request').select(
        'license_request.*',
        'ads_location.location as ads_location_name',
        'location_type.name as ads_location_type_name',
        'ads_panel_type.name as ads_panel_type_name',
        'ads_type.name as ads_type_name',
        'ads_panel.width as width',
        'ads_panel.height as height',
        'ward.name as ward_name',
        'district.name as district_name',
        'image.imgLink as img_link'
      )
      .leftJoin('ads_location', 'license_request.adsLocationId', 'ads_location.adsLocationId')
      .leftJoin('location_type', 'ads_location.locationType', 'location_type.locationTypeId')
      .leftJoin('ads_type', 'ads_location.adsType', 'ads_type.adsTypeId')
      .leftJoin('ads_panel', 'license_request.adsPanelId', 'ads_panel.adsPanelId')
      .leftJoin('ads_panel_type', 'ads_panel.adsPanelTypeId', 'ads_panel_type.adsPanelTypeId')
      .leftJoin('ward', 'license_request.wardId', 'ward.wardId')
      .leftJoin('district', 'license_request.districtId', 'district.districtId')
      .leftJoin('image', 'license_request.imgId', 'image.imgId')
      .where('license_request.wardId', wardId)
      .orderBy('startDate');
  },
  patch(entity){
    const id = entity.licenseRequestId;
    delete entity.licenseRequestId;
    return db('license_request').where('licenseRequestId', id).update(entity);
  }
}