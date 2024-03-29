import db from '../../utils/db.js';

export default {
  findAll() {
    return db('ads_location').select(
        'ads_location.*',
        'ads_type.name as ads_type_name',
        'image.imgLink as image_link',
        'location_type.name as location_type_name',
        'ward.name as ward_name',
        'district.name as district_name'
      )
      .join('ads_type', 'ads_location.adsType', '=', 'ads_type.adsTypeId')
      .join('image', 'ads_location.imgId', '=', 'image.imgId')
      .join('location_type', 'ads_location.locationType', '=', 'location_type.locationTypeId')
      .join('district', 'ads_location.districtId', '=', 'district.districtId')
      .join('ward', 'ads_location.wardId', '=', 'ward.wardId').orderBy('district_name').orderBy('ward_name').orderBy('location');
  },
  findById(id) {
    return db('ads_location').select(
      'ads_location.*',
      'ads_type.name as ads_type_name',
      'image.imgLink as image_link',
      'location_type.name as location_type_name',
      'ward.name as ward_name',
      'district.name as district_name'
    )
    .join('ads_type', 'ads_location.adsType', '=', 'ads_type.adsTypeId')
    .join('image', 'ads_location.imgId', '=', 'image.imgId')
    .join('location_type', 'ads_location.locationType', '=', 'location_type.locationTypeId')
    .join('ward', 'ads_location.wardId', '=', 'ward.wardId')
    .join('district', 'ads_location.districtId', '=', 'district.districtId')
    .where('adsLocationId', id).first();
  },
  findAllByWardId(wardId) {
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
      .join('ward', 'ads_location.wardId', '=', 'ward.wardId').whereExists(function () {
        this.select(1)
          .from('ads_panel')
          .whereRaw('ads_panel.adsLocationId = ads_location.adsLocationId')
          .whereNull('ads_panel.licenseId');
      }).where('ads_location.wardId', wardId).orderBy('location');
  },
  findAllWardByDistrictId(districtId) {
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
      .join('ward', 'ads_location.wardId', '=', 'ward.wardId').whereExists(function () {
        this.select(1)
          .from('ads_panel')
          .whereRaw('ads_panel.adsLocationId = ads_location.adsLocationId')
          .whereNull('ads_panel.licenseId');
      }).where('ads_location.districtId', districtId).orderBy('location');
  },
  findAllByWard(wardId) {
    return db('ads_location').select(
      'ads_location.*',
      'ads_type.name as ads_type_name',
      'image.imgLink as image_link',
      'location_type.name as location_type_name',
      'ward.name as ward_name',
      'district.name as district_name'
    )
    .join('ads_type', 'ads_location.adsType', '=', 'ads_type.adsTypeId')
    .join('image', 'ads_location.imgId', '=', 'image.imgId')
    .join('location_type', 'ads_location.locationType', '=', 'location_type.locationTypeId')
    .join('ward', 'ads_location.wardId', '=', 'ward.wardId')
    .join('district', 'ads_location.districtId', '=', 'district.districtId')
    .where('ads_location.wardId', wardId).orderBy('location');
  },
  findAllByDistrict(districtId) {
    return db('ads_location').select(
      'ads_location.*',
      'ads_type.name as ads_type_name',
      'image.imgLink as image_link',
      'location_type.name as location_type_name',
      'ward.name as ward_name',
      'district.name as district_name'
    )
    .join('ads_type', 'ads_location.adsType', '=', 'ads_type.adsTypeId')
    .join('image', 'ads_location.imgId', '=', 'image.imgId')
    .join('location_type', 'ads_location.locationType', '=', 'location_type.locationTypeId')
    .join('ward', 'ads_location.wardId', '=', 'ward.wardId')
    .join('district', 'ads_location.districtId', '=', 'district.districtId')
    .where('ads_location.districtId', districtId).orderBy('ward_name').orderBy('location');
  },
  findByName(name){
    return db('ads_location').where('location', name).first();
  },
  add(entity) {
    return db('ads_location').insert(entity);
  },
  del(id) {
    return db('ads_location').where('adsLocationId', id).del();
  },
  patch(entity) {
    const id = entity.adsLocationId;
    delete entity.adsLocationId;
    return db('ads_location').where('adsLocationId', id).update(entity);
  },
}