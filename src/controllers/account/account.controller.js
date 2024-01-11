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
  res.render("account/otp", {
    username: req.session.username,
    email: req.session.email,
  });
};

const post_verification = async function (req, res) {
  //console.log(req.body);
  const user = await accountService.findByUsername(req.body.username);
  if (!user) {
    return res.render("account/otp.hbs", {
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
  //console.log("OTP:" + OTP);

  const ret = bcrypt.compareSync(OTP, user.otp);
  if (ret === false) {
    console.log("Invalid OTP");
    req.session.err_message = "Invalid OTP.";
    return res.redirect("/verification");
  }
  const username = req.body.username
  const temp = await accountService.updateStatus(username, "Change Password");

  res.redirect("/change-password");
};

const getForgotpassword = function (req, res) {
  res.render("account/forgot-password");
};

const postForgotpassword = async function (req, res) {
  try {
    const email = req.body.email;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = bcrypt.hashSync(verificationCode, salt);

    const user = await accountService.findByEmail(email);
    if (!user) {
      req.session.err_message = "Not Found User";
      return res.redirect("/forgot-password");
    }
    const temp = await accountService.updateToken(email, verificationToken);

    const mailOptions = {
        from: "ntson21@clc.fitus.edu.vn",
        to: req.body.email,
        subject: "OTP Code for Ads Management website",
        text: `Dear user ${user.username}
        \nYou have choose ${req.body.email} as email address for verification page.
        \nYour OTP code is ${verificationCode}
        \nIf you have not requested this, please ignore this email. \n`,
    };

    await transporter.sendMail(mailOptions);
    req.session.username = user.username;
    req.session.email = user.email;
    res.redirect("/verification");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getChangePassword = function (req, res) {
    res.render("account/change-password.hbs");
}

const postChangePassword = async function (req, res) {
  console.log("post change pass",req.body);
    try {
        const username = req.session.username;
        const password = req.body.password;
        const hash = await bcrypt.hashSync(password, salt);
        const temp = await accountService.updatePassword(username, hash);
        const temp1 = await accountService.updateStatus(username, "Active");
        req.session.err_message = "Change password successfully";
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

export default {
    getLogin,
    postLogin,
    logout,
    getForgotpassword,
    postForgotpassword,
    get_verification,
    post_verification,
    getChangePassword,
    postChangePassword
};
