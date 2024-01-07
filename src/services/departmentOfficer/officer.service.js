import db from '../../utils/db.js';

export default {
  findAll() {
    return db('account');
  },
  add(entity) {
    return db('account').insert(entity);
  },
  findById(id) {
    return db('account').where('accountId', id).first();
  },
  findByUsername(username) {
    return db('account').where('username', username).first();
  },
  del(id) {
    return db('account').where('accountId', id).del();
  },
  patch(entity) {
    const id = entity.id;
    delete entity.id;
    return db('account').where('accountId', id).update(entity);
  }
}