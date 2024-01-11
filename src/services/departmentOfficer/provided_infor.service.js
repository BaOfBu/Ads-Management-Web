import db from '../../utils/db.js';

export default {
  findAll(database) {
    return db(database);
  },
  add(database, entity) {
    return db(database).insert(entity);
  },
  findById(database, field, id) {
    return db(database).where(field, id).first();
  },
  findByName(database, name) {
    return db(database).where('name', name).first();
  },
  del(database, field, id) {
    return db(database).where(field, id).del();
  },
}