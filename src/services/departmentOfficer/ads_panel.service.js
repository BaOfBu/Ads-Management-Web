import db from '../../utils/db.js';

export default {
  findAll() {
    return db('ads_panel').select(
        'ads_panel.*',
        'image.imgLink as image_link',
        'ads_location.location as ads_location_name',
        'ads_panel_type.name as ads_panel_type_name'
      )
      .join('image', 'ads_panel.imgId', '=', 'image.imgId')
      .join('ads_location', 'ads_panel.adsLocationId', '=', 'ads_location.adsLocationId')
      .join('ads_panel_type', 'ads_panel.adsPanelTypeId', '=', 'ads_panel_type.adsPanelTypeId');
  },
  findById(id) {
    return db('ads_panel').select(
      'ads_panel.*',
      'image.imgLink as image_link',
      'ads_location.location as ads_location_name',
      'ads_panel_type.name as ads_panel_type_name'
    )
    .join('image', 'ads_panel.imgId', '=', 'image.imgId')
    .join('ads_location', 'ads_panel.adsLocationId', '=', 'ads_location.adsLocationId')
    .join('ads_panel_type', 'ads_panel.adsPanelTypeId', '=', 'ads_panel_type.adsPanelTypeId').where('adsPanelId', id).first();
  },
}