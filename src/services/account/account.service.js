import db from '../../utils/db.js';

export default {
  findAll() {
    return db('account');
  },
  add(entity) {
    return db('account').insert(entity);
  },
  findByUsername(username) {
    return db('account').where('username', username).first();
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