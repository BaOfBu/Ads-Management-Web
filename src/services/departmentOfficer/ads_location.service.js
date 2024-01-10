import db from '../../utils/db.js';

export default {
  findAll() {
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
      .join('ward', 'ads_location.wardId', '=', 'ward.wardId').orderBy('ward_name');
  },
  findById(id) {
    return db('ads_location').where('districtId', id).first();
  },
  patch(entity) {
    const id = entity.districtId;
    delete entity.districtId;
    return db('district').where('districtId', id).update(entity);
  }
}