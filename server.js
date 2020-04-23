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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
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

async function printTables() {
    try {
        console.log("SHOW TABLES");
        response = await pool.query({ sql: 'SHOW TABLES;' });
        console.log(response[0]);
    } catch (err) {
        console.log(err);
    }
}

// create all the tables for tron
async function createTables() {
    try {
        console.log("Creating tables anew");
        console.log("Deleting old tables if they exist...");
        let response = await pool.query('DROP TABLE IF EXISTS game;');
        response = await pool.query('DROP TABLE IF EXISTS series;');
        response = await pool.query('DROP TABLE IF EXISTS account;');
        response = await pool.query('DROP TABLE IF EXISTS script;');
        response = await pool.query('DROP TABLE IF EXISTS replay;');
        response = await pool.query('DROP TABLE IF EXISTS player;');

        console.log("Creating new tables...")
        response = await pool.query('CREATE TABLE IF NOT EXISTS player (' +
            'playerId INTEGER PRIMARY KEY AUTO_INCREMENT, ' + 
            'botName TEXT, partner1 TEXT, partner2 TEXT, partner3 TEXT,' +
            'rank INTEGER, elo FLOAT, score FLOAT);');
        response = await pool.query('CREATE TABLE IF NOT EXISTS replay (' +
            'replayId INTEGER PRIMARY KEY AUTO_INCREMENT, ' + 
            'link TEXT);');
        response = await pool.query('CREATE TABLE IF NOT EXISTS series (' +
            'seriesId INTEGER PRIMARY KEY AUTO_INCREMENT, ' + 
            'playerOneId INTEGER,' +
            'INDEX pOneId (playerOneId),' +
            'FOREIGN KEY (playerOneId)' +
            '    REFERENCES player(playerId)' +
            '    ON DELETE CASCADE,' +
            'playerTwoId INTEGER,' +
            'INDEX pTwoId (playerTwoId),' +
            'FOREIGN KEY (playerTwoId)' +
            '    REFERENCES player(playerId)' +
            '    ON DELETE CASCADE,' +
            'seriesWinner INTEGER,' +
            'INDEX seriesWinnerId (seriesWinner),' +
            'FOREIGN KEY (seriesWinner)' +
            '    REFERENCES player(playerId)' +
            '    ON DELETE CASCADE);');
        response = await pool.query('CREATE TABLE IF NOT EXISTS game (' +
            'gameId INTEGER PRIMARY KEY AUTO_INCREMENT, ' + 
            'seriesId INTEGER, ' +
            'INDEX sId (seriesId),' +
            'FOREIGN KEY (seriesId)' +
            '    REFERENCES series(seriesId)' +
            '    ON DELETE CASCADE,' +
            'playerOneId INTEGER, ' +
            'INDEX pOneId (playerOneId),' +
            'FOREIGN KEY (playerOneId)' +
            '    REFERENCES player(playerId)' +
            '    ON DELETE CASCADE,' +
            'playerTwoId INTEGER, ' +
            'INDEX pTwoId (playerTwoId),' +
            'FOREIGN KEY (playerTwoId)' +
            '    REFERENCES player(playerId)' +
            '    ON DELETE CASCADE,' +
            'winnerId INTEGER, ' +
            'INDEX wId (winnerId),' +
            'FOREIGN KEY (winnerId)' +
            '    REFERENCES player(playerId)' +
            '    ON DELETE CASCADE,' +
            'replayId INTEGER, ' +
            'INDEX rId (replayId),' +
            'FOREIGN KEY (replayId)' +
            '    REFERENCES replay(replayId)' +
            '    ON DELETE CASCADE' +
            ');');

        // stretch goal tables
        response = await pool.query('CREATE TABLE IF NOT EXISTS account (' +
            'accountName VARCHAR(255) PRIMARY KEY, ' + 
            'playerId INTEGER,' +
            'INDEX pId (playerId),' +
            'FOREIGN KEY (playerId)' +
            '    REFERENCES player(playerId)' +
            '    ON DELETE CASCADE,' +
            'username TEXT, password TEXT, email TEXT);');

        response = await pool.query('CREATE TABLE IF NOT EXISTS script (' +
            'scriptId INTEGER PRIMARY KEY AUTO_INCREMENT, ' + 
            'scriptString TEXT,' +
            'playerId INTEGER,' +
            'INDEX pId (playerId),' +
            'FOREIGN KEY (playerId)' +
            '    REFERENCES player(playerId)' +
            '    ON DELETE CASCADE);');
        
        console.log("All tables created successfully");
    } catch (err) {
        console.log(err);
    }
}

//createTables();
//printTables();