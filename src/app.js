import express from 'express';
import knex from 'knex';
import { engine } from 'express-handlebars';
import hbs_sections from 'express-handlebars-sections';
import session from 'express-session';
import path from "path";

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import numeral from 'numeral';

import wardOfficerRoute from './routes/wardOfficer/index.route.js';
import districtOfficerRoute from './routes/districtOfficer/index.route.js';
import departmentOfficerRoute from './routes/departmentOfficer/index.route.js';

const port = 3000;
const app = express();
app.use(express.urlencoded({
  extended: true
}));
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
        }
    }
});

app.engine("hbs", hbs);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use('/static', express.static('static'));

app.use('/ward-officer', wardOfficerRoute);
app.use('/district-officer', districtOfficerRoute);
app.use('/department-officer', departmentOfficerRoute);

app.listen(port, function serverStartedHandler() {
    console.log(`Ads Management server is running at http://localhost:${port}`);
});