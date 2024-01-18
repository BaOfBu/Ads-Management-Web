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
  },
  findAllWardOfficerAndDistrictOfficer() {
    return db('account')
    .select(
    'account.*',
    'ward.name as ward_name',
    'district.name as district_name')
    .leftJoin('ward', 'account.wardId', '=', 'ward.wardId')
    .leftJoin('district', 'account.districtId', '=', 'district.districtId')
    .whereNot('role', 'Department')
    .orderBy('district_name').orderBy('ward_name').orderBy('account.name');
  },
  findAllByRole(role){
    return db('account')
    .select(
    'account.*',
    'ward.name as ward_name',
    'district.name as district_name')
    .leftJoin('ward', 'account.wardId', '=', 'ward.wardId')
    .leftJoin('district', 'account.districtId', '=', 'district.districtId')
    .where('role', role)
    .orderBy('district_name').orderBy('ward_name').orderBy('account.name');
  }
}