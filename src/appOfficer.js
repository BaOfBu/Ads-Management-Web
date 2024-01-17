import express from "express";
import knex from "knex";
import { engine } from "express-handlebars";
import hbs_sections from "express-handlebars-sections";
import session from "express-session";
import path from "path";
import cors from "cors";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import numeral from "numeral";

import wardOfficerRoute from "./routes/wardOfficer/index.route.js";
import districtOfficerRoute from "./routes/districtOfficer/index.route.js";
import departmentOfficerRoute from "./routes/departmentOfficer/index.route.js";
import accountRoute from "./routes/account/index.route.js";
import getDataRoute from "./routes/get-data/index.route.js";

import auth from "./middleware/auth.mdw.js";

const port = 8888;
const app = express();
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());

const hbs = engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views"),
    partialsDir: [
        path.join(__dirname, "views/wardOfficer/partials"),
        path.join(__dirname, "views/districtOfficer/partials"),
        path.join(__dirname, "views/departmentOfficer/partials")
    ],
    helpers: {
        section: hbs_sections(),
        format_number(val) {
            return numeral(val).format("0,0");
        },
        equal(value1, value2) {
            return value1 == value2;
        },
        json: function (context) {
            return JSON.stringify(context);
        },
        console: function (value) {
            console.log(value);
        },
        increment: function (value) {
            return parseInt(value) + 1;
        },
        decrement: function (value) {
            return parseInt(value) - 1;
        },
    }
});

app.engine("hbs", hbs);
app.set("view engine", "hbs");
app.set("views", "./views");
app.set("trust proxy", 1);
app.use(
    session({
        secret: "Ads-management-web-app",
        resave: false,
        saveUninitialized: true,
        cookie: {}
    })
);
app.use(function (req, res, next) {
    // console.log(req.session.auth);
    if (typeof req.session.auth === "undefined") {
        req.session.auth = false;
    }
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    next();
});

app.use(cors({ origin: "http://localhost:3000" }));

app.use("/static", express.static("static"));

app.use("/ward-officer", auth.authWardOfficer, wardOfficerRoute);
app.use("/get-data", getDataRoute);
app.use("/district-officer",auth.authDistrictOfficer, districtOfficerRoute);
app.use("/department-officer", auth.authDepartmentOfficer, departmentOfficerRoute);
app.use("/", auth.authUser, accountRoute);

app.listen(port, function serverStartedHandler() {
    console.log(`Ads Management server is running at http://localhost:${port}`);
});
