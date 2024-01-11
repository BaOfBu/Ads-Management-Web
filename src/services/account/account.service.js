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
  findByEmail(email) {
    return db('account').where('email', email).first();
  },
  updateToken(email, token) {
    console.log("token",token);
    return db('account').where('email', email).update('otp', token);
  },
  updateStatus(username, status) {
    return db('account').where('username', username).update('status', status);
  },
  updatePassword(username, password) {
    return db('account').where('username', username).update('password', password);
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