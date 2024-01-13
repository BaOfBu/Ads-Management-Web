import db from '../../utils/db.js';

export default {
  findAll() {
    return db('edit_ads_panel_request').select(
        'edit_ads_panel_request.*',
        'ads_panel_type.name as ads_panel_type_name',
        'ads_location.location as ads_location_name',
      )
      .join('ads_panel_type', 'edit_ads_panel_request.adsPanelTypeId', '=', 'ads_panel_type.adsPanelTypeId')
      .join('ads_location', 'edit_ads_panel_request.adslocationId', '=', 'ads_location.adslocationId')
      .orderBy('requestTime');
  }
}