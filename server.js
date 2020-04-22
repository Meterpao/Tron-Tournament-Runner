// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const path = require('path');

// import handlers
const homeHandler = require('./controllers/home.js');
const loginHandler = require('./controllers/login.js');
const aboutHandler = require('./controllers/about.js');
const leaderboardHandler = require('./controllers/leaderboard.js');
// TODO this should be a catch-all route
const studentProfileHandler = require('./controllers/studentProfile.js');

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set up stylesheets route

// TODO: Add server side code

// Create controller handlers to handle requests at each endpoint
app.get('/', homeHandler.getHome);
app.get('/about', aboutHandler.getAbout);
app.get('/login', loginHandler.getLogin);
app.get('/leaderboard', leaderboardHandler.getLeaderboard);
app.get('/studentProfile', studentProfileHandler.getProfile);

// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

const mysql = require('mysql2/promise');
//const moment = require('moment');
const user = 'admin';
const password = 'tronpassword';
const db = 'main';
const host = 'tron-database.cepklshydjdt.us-east-1.rds.amazonaws.com';
const dbPort = '3306';

const pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    port: dbPort,
    database: db
});

async function printDb() {
    try {
        response = await pool.query({sql: 'SHOW DATABASES;'});
        console.log(response);
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function printTables() {
    try {
        console.log("SHOW TABLES");
        response = await pool.query({sql: 'SHOW TABLES;'});
        console.log(response);
    } catch (err) {
        console.log(err);
        return [];
    }
}

printTables();