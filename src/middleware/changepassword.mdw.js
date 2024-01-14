import accountService from "../services/account/account.service.js";

const checkStatus = async (req, res, next) => {
    const user = await accountService.findByUsername(req.session.username);
    //console.log(user);
    if(user.status === 'Change Password'){
        return next();
    }
    return res.redirect('/');
}

export default{checkStatus}