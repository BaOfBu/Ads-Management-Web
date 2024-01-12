const saveReport = async function (req, res) {
    console.log(req.body);
    res.json(true);
};

export default { saveReport };
