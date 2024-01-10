import bcrypt from "bcryptjs";
import accountService from "../../services/account/account.service.js";
import nodemailer from "nodemailer";

const salt = bcrypt.genSaltSync(10);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ntson21@clc.fitus.edu.vn",
    pass: "Ntson2101296773776",
  },
});

const getLogin = function (req, res) {
  req.session.retUrl = req.headers.referer || "/";
  res.render("account/login.hbs");
};

const postLogin = async function (req, res) {
    console.log(req.body);
  const user = await accountService.findByUsername(req.body.username);
  console.log(user);
  if (!user) {
    return res.render("account/login", {
      err_message: "Invalid username or password.",
    });
  }

  const ret = bcrypt.compareSync(req.body.password, user.password);
  console.log("ret:",ret);
  if (ret === false) {
    return res.render("account/login", {
      err_message: "Invalid username or password.",
    });
  }
  delete user.password;
  req.session.auth = true;
  req.session.authUser = user;

  //console.log(url);
  if (user.role === "Ward") {
    return res.redirect("/ward-officer");
  }
  if (user.role === "District") {
    return res.redirect("/district-officer");
  }
  if (user.role === "Department") {
    return res.redirect("/department-officer");
  }
  return res.redirect(url);

};

const logout = function (req, res) {
  // console.log("logout");
  req.session.retUrl = req.headers.referer || "/";
  req.session.auth = false;
  req.session.authUser = undefined;
  req.session.order = "";
  req.session.numberItem = 0;
  res.redirect("/account/login");
  //localStorage.removeItem("selectedDateRange");
};


const get_verification = function (req, res) {
  res.render("user/verification", {
    username: req.session.username,
    email: req.session.email,
  });
};

const post_verification = async function (req, res) {
  console.log(req.body);
  const user = await userService.findByUsername(req.body.username);
  if (!user) {
    return res.render("user/verification", {
      err_message: "Invalid user.",
    });
  }
  const OTP =
    req.body.first +
    req.body.second +
    req.body.third +
    req.body.fourth +
    req.body.fifth +
    req.body.sixth;
  console.log("OTP:" + OTP);

  const ret = bcrypt.compareSync(OTP, user.emailVerificationToken);
  if (ret === false) {
    req.session.err_message = "Invalid OTP.";
    return res.redirect("/account/register/verification");
  }

  if (user.emailVerificationExpires < Date.now()) {
    req.session.err_message = "OTP expired.";
    return res.redirect("/account/register/verification");
  }
  const username = req.body.username
  const temp = await Account.findOneAndUpdate({username}, {$set: {status: "active"}}, {new: true})

  res.redirect("/account/login");
};

const getForgotpassword = function (req, res) {
  res.render("account/forgot-password");
};

const postForgotpassword = async function (req, res) {
  try {
    const email = req.body.email;
    const newpass = Math.random().toString(36).substring(2, 10);
    const hash_password = bcrypt.hashSync(newpass, salt);

    const user = await userService.findByEmail(email);
    if (!user) {
      req.session.err_message = "Not Found User";
      return res.redirect("/account/forgotpasswword");
    }
    const temp = await userService.updateOne(email, hash_password);

    const mailOptions = {
      from: "ntson21@clc.fitus.edu.vn",
      to: req.body.email,
      subject: "New Password for Door-rush website",
      text: `Your New Password is ${newpass}\n\nPlease go to your profile page to change your password as soon as possible`,
    };

    await transporter.sendMail(mailOptions);

    req.session.email = req.body.email;
    res.redirect("/account/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export default {
    getLogin,
    postLogin,
    logout,
    getForgotpassword,
    postForgotpassword,
    get_verification,
    post_verification,
};
