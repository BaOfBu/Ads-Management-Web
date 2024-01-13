import db from '../../utils/db.js';

export default {
  findAll() {
    return db('edit_ads_panel_request').select(
        'edit_ads_panel_request.*',
        'ads_panel_type.name as ads_panel_type_name',
        'ads_location.location as ads_location_name',
        'ward.name as ward_name',
        'district.name as district_name'
      )
      .join('ads_panel_type', 'edit_ads_panel_request.adsPanelTypeId', '=', 'ads_panel_type.adsPanelTypeId')
      .join('ads_location', 'edit_ads_panel_request.adslocationId', '=', 'ads_location.adslocationId')
      .join('ward', 'edit_ads_panel_request.wardId', '=', 'ward.wardId')
      .join('district', 'edit_ads_panel_request.districtId', '=', 'district.districtId')
      .orderBy('requestTime');
  },
  findByWardId(wardId) {
    return db('edit_ads_panel_request').select(
        'edit_ads_panel_request.*',
        'ads_panel_type.name as ads_panel_type_name',
        'ads_location.location as ads_location_name',
        'ward.name as ward_name',
        'district.name as district_name'
      )
      .join('ads_panel_type', 'edit_ads_panel_request.adsPanelTypeId', '=', 'ads_panel_type.adsPanelTypeId')
      .join('ads_location', 'edit_ads_panel_request.adslocationId', '=', 'ads_location.adslocationId')
      .join('ward', 'edit_ads_panel_request.wardId', '=', 'ward.wardId')
      .join('district', 'edit_ads_panel_request.districtId', '=', 'district.districtId')
      .where('edit_ads_panel_request.wardId', wardId)
      .orderBy('requestTime');
  },
  patch(entity){
    const id = entity.requestId;
    delete entity.requestId;
    return db('edit_ads_panel_request').where('requestId', id).update(entity);
  }
}