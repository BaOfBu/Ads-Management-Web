import db from '../../utils/db.js';

export default {
  findAll() {
    return db('edit_ads_location_request').select(
        'edit_ads_location_request.*',
        'ads_type.name as ads_type_name',
        'ads_location.location as ads_location_name',
        'location_type.name as ads_location_type_name',
        'image.imgLink as img_link',
        'ward.name as ward_name',
        'district.name as district_name'
      )
      .join('ads_type', 'edit_ads_location_request.adsTypeId', '=', 'ads_type.adsTypeId')
      .join('ads_location', 'edit_ads_location_request.adsLocationId', '=', 'ads_location.adsLocationId')
      .join('location_type', 'edit_ads_location_request.adsLocationTypeId', '=', 'location_type.locationTypeId')
      .join('image', 'edit_ads_location_request.imgId', '=', 'image.imgId')
      .join('ward', 'edit_ads_location_request.wardId', '=', 'ward.wardId')
      .join('district', 'edit_ads_location_request.districtId', '=', 'district.districtId')
      .orderBy('requestTime');
  },
}