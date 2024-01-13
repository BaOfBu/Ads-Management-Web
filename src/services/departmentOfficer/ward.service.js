import db from '../../utils/db.js';

export default {
  findAll() {
    return db('ward').orderBy('name');
  },
  add(entity) {
    return db('ward').insert(entity);
  },
  findById(id) {
    return db('ward').where('wardId', id).first();
  },
  findAllByDistrictId(districtId){
    return db('ward').where('districtId', districtId).orderBy('name');
  },
  findByName(name) {
    return db('ward').where('name', name).first();
  },
  getIdByName(name) {
    return db('ward').where('name', name).first();
  },
  findByNameWithDistrictId(districtId, name){
    return db('ward').where({'districtId': districtId, 'name': name}).first();
  },
  del(id) {
    return db('ward').where('wardId', id).del();
  },
  patch(entity) {
    const id = entity.wardId;
    delete entity.wardId;
    return db('ward').where('wardId', id).update(entity);
  }
}