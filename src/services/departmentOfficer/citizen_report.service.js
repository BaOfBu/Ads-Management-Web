import db from '../../utils/db.js';

export default {
  findAll() {
    return db('citizen_report').select(
      'citizen_report.*',
      'report_type.name as report_type_name',
      'ward.name as ward_name',
      'district.name as district_name'
    )
    .join('report_type', 'citizen_report.reportTypeId', '=', 'report_type.reportTypeId')
    .join('ward', 'citizen_report.wardId', '=', 'ward.wardId')
    .join('district', 'citizen_report.districtId', '=', 'district.districtId')
    .orderBy('sendDate');
  },
  findAllByWard(wardId) {
    return db('citizen_report').select(
      'citizen_report.*',
      'report_type.name as report_type_name',
      'ward.name as ward_name',
      'district.name as district_name'
    )
    .join('report_type', 'citizen_report.reportTypeId', '=', 'report_type.reportTypeId')
    .join('ward', 'citizen_report.wardId', '=', 'ward.wardId')
    .join('district', 'citizen_report.districtId', '=', 'district.districtId')
    .where('citizen_report.wardId', wardId)
    .orderBy('sendDate');
  },
}