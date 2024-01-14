import db from '../../utils/db.js';

export default {
    add(entity) {
        return db('license_request').insert(entity);
    },
}
