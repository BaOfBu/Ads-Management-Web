const index = async function (req, res) {
    res.render("citizen/home");
};
const report = async function (req, res) {
    const adsPanelId = req.query.adsPanelId;
    res.render("citizen/report", {
        lat: req.query.lat,
        lng: req.query.long,
        status: req.query.status,
        isAdsPanel: adsPanelId != "",
        adsPanelId: adsPanelId
    });
};
export default { index, report };
