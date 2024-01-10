import express from "express";
import accountController from '../../controllers/account/account.controller.js';
import auth from '../../middleware/auth.mdw.js';
const router = express.Router();

function setDefaultLayoutAndPartials(req, res, next) {
    res.locals.layout = "account/layouts/main";
    next();
}
router.use(setDefaultLayoutAndPartials);

router.get('/forgot-password', accountController.getForgotpassword);

router.post('/forgot-password', accountController.postForgotpassword);

router.get('/', accountController.getLogin);

router.post('/', accountController.postLogin);

router.post('/logout',auth.authLogout, accountController.logout);

export default router;
