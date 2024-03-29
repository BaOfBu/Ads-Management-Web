import db from "../../utils/db.js";

export default {
  findAll() {
    return db('account');
  },
  add(entity) {
    return db('account').insert(entity);
  },
  findById(id) {
    return db('account')
    .select(
      'account.*',
      'ward.name as ward_name',
      'district.name as district_name')
      .leftJoin('ward', 'account.wardId', '=', 'ward.wardId')
      .leftJoin('district', 'account.districtId', '=', 'district.districtId')
    .where('accountId', id).first();
  },
  findByUsername(username) {
    return db('account').where('username', username).first();
  },
  del(id) {
    return db('account').where('accountId', id).del();
  },
  patch(entity) {
    const id = entity.accountId;
    delete entity.accountId;
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
    .join('district', 'account.districtId', '=', 'district.districtId')
    .where('role', role)
    .orderBy('district_name').orderBy('ward_name').orderBy('account.name');
  },
  findByIdWardDistrict(id) {
      return db("account")
          .select("account.*", "district.name as districtName", "ward.name as wardName")
          .where("accountId", id)
          .where("role", "!=", "Department")
          .join("district", "district.districtId", "=", "account.districtId")
          .leftJoin("ward", "ward.wardId", "=", "account.wardId")
          .first();
  }
};
