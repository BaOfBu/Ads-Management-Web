const index = async function (req, res) {
    res.render("citizen/home");
};
const report = async function (req, res) {
    const adsPanelId = req.query.adsPanelId;
    if (adsPanelId) {
    }
    res.render("citizen/report", {
        adsPanelId: adsPanelId
    });
};
export default { index, report };
