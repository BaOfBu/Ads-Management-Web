import db from '../../utils/db.js';

export default {
    findAllAdsPanelByWardId(wardId){
        return db('ads_panel').select(
            'ads_panel.*',
            'ads_location.location as location_name',
            'ads_panel_type.name as ads_panel_type_name',
            'ads_location.adsLocationId as ads_location_id',
            'ads_panel.adsPanelId as ads_panel_id',
        )
        .join('ads_location', 'ads_panel.adsLocationId', '=', 'ads_location.adsLocationId')
        .join('ads_panel_type', 'ads_panel.adsPanelTypeId', '=', 'ads_panel_type.adsPanelTypeId')
        .where('ads_location.wardId', wardId).orderBy('ads_panel.adsPanelId');
    },

    findAllAdsPanelByWardIdAndKeyword(wardId, keyword){
        return db('ads_panel').select(
            'ads_panel.*',
            'ads_location.location as location_name',
            'ads_panel_type.name as ads_panel_type_name',
            'ads_location.adsLocationId as ads_location_id',
            'ads_panel.adsPanelId as ads_panel_id',
        )
        .join('ads_location', 'ads_panel.adsLocationId', '=', 'ads_location.adsLocationId')
        .join('ads_panel_type', 'ads_panel.adsPanelTypeId', '=', 'ads_panel_type.adsPanelTypeId')
        .where('ads_location.wardId', wardId).andWhere('ads_location.location', 'like', `%${keyword}%`).orderBy('ads_panel.adsPanelId');
    }
}