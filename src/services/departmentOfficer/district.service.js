import db from '../../utils/db.js';

export default {
  findAll() {
    return db('district').orderBy('name');
  },
  add(entity) {
    return db('district').insert(entity);
  },
  findById(id) {
    return db('district').where('districtId', id).first();
  },
  findByName(name) {
    return db('district').where('name', name).first();
  },
  getIdByName(name) {
    return db('district').where('name', name).first();
  },
  del(id) {
    return db('district').where('districtId', id).del();
  },
  patch(entity) {
    const id = entity.districtId;
    delete entity.districtId;
    return db('district').where('districtId', id).update(entity);
  }
}