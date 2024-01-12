const index = async function (req, res) {
    res.render("citizen/home");
};
const report = async function (req, res) {
    console.log(req.query.adsPanelId);
    console.log(req.query.locationId);
    res.render("citizen/report");
};
export default { index, report };
