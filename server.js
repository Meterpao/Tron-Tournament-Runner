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
app.get('/getPlayers', getPlayers);
app.get('/:player', getPlayer);

// this should be a catch all, similar to rooms in assignment 4
app.get('/studentProfile', studentProfileHandler.getProfile);

// API functions

async function getPlayers(request, response) {
    let players = await dbGetAllPlayers();
    response.json(players);
}

// endpoint that will return the profile page for the player specified in the request
// parameters. Renders the student Profile page.
async function getPlayer(request, response) {
    let player = request.params.player;
    let playerInfo = await dbGetPlayer(player);
    // if player does not exist, db query returns empty object which will not have
    // playerId key
    let playerExists = typeof playerInfo['playerId'] !== 'undefined';
    if (playerExists) {
        response.render('studentProfile', { 
            botName: player, 
            partner1: playerInfo['partner1'],
            partner2: playerInfo['partner2'],
            partner3: playerInfo['partner3'],
            elo: playerInfo['elo'],
            score: playerInfo['score'],
        });
    } else {
        response.status(404).send('\'' + player + '\' bot does not exist');
    }
}


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
        let tables = response[0];
        for (let i = 0; i < tables.length; i++) {
            let table = tables[i]['Tables_in_main'];
            console.log("TABLE: " + table);
            response = await pool.query('DESCRIBE ' + table + ";");
            console.log(response[0]);
            response = await pool.query('SELECT * FROM ' + table + ";");
            console.log(response[0]);
        }
    } catch (err) {
        console.log(err);
    }
}

// returns a list of all players (players as dictionary objects)
async function dbGetAllPlayers() {
    let result = [];
    try {
        response = await pool.query({ sql: 'SELECT * FROM player;' });
        let players = response[0];
        for (let i = 0; i < players.length; i++) {
            result.push(players[i]);
        }
    } catch (err) {
        console.log(err);
    }
    return result;
}

// given a bot name, get the rest of the player's information
async function dbGetPlayer(botName) {
    let result;
    try {
        let statement = 'SELECT * FROM player WHERE botName = ?;';
        response = await pool.query(statement, [botName]);
        result = response[0][0];
    } catch (err) {
        console.log(err);
    }
    return result;
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
            'elo FLOAT, score FLOAT);');
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

async function initFakeData() {
    let success = await initFakePlayerData();
    console.log("Initialized fake player data: " + success);
    success = await initFakeSeriesData();
    console.log("Initialized fake series data: " + success);
}

async function initFakePlayerData() {
    let playerStatement = 'INSERT INTO player (botName, partner1, partner2, elo, score)' +
        ' VALUES (?,?,?,?,?);';
    let fakePlayerData = [
        ['bot1', 'me', 'you', 1000, '10'],
        ['bot2', 'bob', 'john', 2000, '20'],
        ['bot3', 'sam', 'carla', 0, '0.5'],
        ['bot4', 'alex', 'julia', 1542.2, '16.5'],
        ['bot5', '@@@', '$$$$', 10, '1.0'],
    ];
    try {
        for (let i = 0; i < fakePlayerData.length; i++) {
            response = await pool.query(playerStatement, fakePlayerData[i]);
            console.log(response);
        }
        console.log("initFakePlayerData complete.");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function initFakeSeriesData() {
    let statement = 'INSERT INTO series (firstBotId, secondBotId, seriesWinner)' +
        ' VALUES (?,?,?);';
    let data = [
        ['bot1', 'bot2', 'bot2'],
        ['bot2', 'bot3', 'bot2'],
        ['bot4', 'bot5', 'bot4'],
        ['bot1', 'bot5', 'bot1']
    ];
    try {
        for (let i = 0; i < fakePlayerData.length; i++) {
            response = await pool.query(statement, data[i]);
            console.log(response);
        }
        console.log("initFakeSeriesData complete.");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

//initFakeData();

// aws access info
// const AWS = require('aws-sdk');
// const fs = require('fs');
// const aws_access_key_id = 'ASIAXANMLBZCDMCPITEX';
// const aws_secret_access_key = 'LV5JF63UxTlLBBHb4gQOn+3J+3VrrEsnnA+UOkhE';
// //configuring the AWS environment
// AWS.config.update({
//     accessKeyId: aws_access_key_id,
//     secretAccessKey: aws_secret_access_key
// });

// Set the region 
// AWS.config.update({region: 'us-east-1'});
// // Create S3 service object
// s3 = new AWS.S3({ apiVersion: '2006-03-01' });
// // Call S3 to list the buckets
// s3.listBuckets(function (err, data) {
//     if (err) {
//         console.log("Error", err);
//     } else {
//         console.log("listing buckets...");
//         console.log("Success", data.Buckets);
//     }
// });


//createTables();
//printTables();