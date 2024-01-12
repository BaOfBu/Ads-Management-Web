import db from '../../utils/db.js';

export default {
  findAll() {
    return db('image');
  },
  add(entity) {
    return db('image').insert(entity);
  },
}