import db from '../../utils/db.js';

export default {
  findAll() {
    return db('image');
  },
  findByLink(link) {
    return db('image').where('imgLink', link).first();
  },
  findById(id) {
    return db('image').where('imgId', id).first();
  },
  add(entity) {
    return db('image').insert(entity);
  },
  del(id){
    return db('image').where('imgId', id).del();
  },
  patch(entity){
    const id = entity.imgId;
    delete entity.imgId;
    return db('image').where('imgId', id).update(entity);
  }
}