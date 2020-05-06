// import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const path = require('path');
const fetch = require("node-fetch");

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
app.get('/getSeriesData/:playerId', getSeriesData);
app.get('/series/:seriesId', renderSeriesPage);
app.get('/player/:player', renderPlayerPage);

// this should be a catch all, similar to rooms in assignment 4
app.get('/studentProfile', studentProfileHandler.getProfile);

// API functions

async function getPlayers(request, response) {
    let players = await dbGetAllPlayers();
    response.json(players);
}

// endpoint that will return the profile page for the player specified in the request
// parameters. Renders the student Profile page.
async function renderPlayerPage(request, response) {
    let botName = request.params.player;
    let playerInfo = await dbGetPlayer(botName);
    if (typeof playerInfo !== 'undefined') {
        response.render('studentProfile', { 
            playerId: playerInfo['playerId'],
            botName: botName, 
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

async function renderSeriesPage(request, response) {
    let seriesId = request.params.seriesId;
    let seriesData = await dbGetSeriesWithSeriesId(seriesId);

    // if there is valid series data...
    if (typeof seriesData !== 'undefined') {
        // TODO: should check these to make sure they're not undefined
        let playerOne = await dbGetPlayerName(seriesData['playerOneId']);
        let playerTwo = await dbGetPlayerName(seriesData['playerTwoId']);
        let firstPlayerWon = seriesData['playerOneId'] === seriesData['seriesWinner'];
        let replayLink = seriesData['replayLink'];
        fetch(replayLink).then(function(response) {
            return response.text()
        }).then(function(text) {
            let player1 = playerOne['botName'];
            let player2 = playerTwo['botName'];
            let tronResult = seriesTextToReplay(text, player1, player2);
            response.render('series', { 
                board: tronResult,
                seriesId: seriesId,
                winCount: seriesData['winCount'],
                lossCount: (5 - parseInt(seriesData['winCount'])),
                playerOne: player1,
                playerTwo: player2,
                winner: firstPlayerWon
            });
        });
    } else {
        response.status(404).send('Cannot render series of id: ' + seriesId);
    }
}

// given the text parsed version of a series,
// converts it to html of the replay
function seriesTextToReplay(text, player1, player2) {
    let tronResults = "";
    let data = JSON.parse(text);
    let boardIndex = 0;

    for (let i = 0; i < data.length; i++) {
        game = data[i];
        d1 = game[0];
        d2 = game[1];
        tronResults += "<div class='game-wrapper'>"
        tronResults += "<div class='game'>"
        let firstTurn = true;
        let flip = false;
        for (let j = 0; j < d1.length; j++) {
            d3 = d1[j];
            d4 = d2[j];
            if (firstTurn) {
                if (d3.includes("x")) {
                    flip = true;
                }
                firstturn = false;
            }
            if (flip) {
                tronResults += boardToHTML(d3)
                tronResults += boardToHTML(d4)
            } else {
                tronResults += boardToHTML(d4)
                tronResults += boardToHTML(d3)
            }
        }
        tronResults += "</div><button class='restart' title='Click to restart' onclick='restart(" + boardIndex + ")'>R</button>";
        if (d1.length === d2.length) {
            if (flip) {
                tronResults += "<p>Winner: Player 2 (" + player2 + ")</p>"
            } else {
                tronResults += "<p>Winner: Player 1 (" + player1 + ")</p>"
            }
        } else {
            if (flip) {
                tronResults += "<p>Winner: Player 1 (" + player1 + ")</p>"
            } else {
                tronResults += "<p>Winner: Player 2 (" + player2 + ")</p>"
            }
        }
        tronResults += "</div>";
        boardIndex += 1;
    }

    return tronResults;
}

// given a string representation of the board,
// returns an HTML representation of the board
function boardToHTML(board) {
    let b = "<div class='board-wrapper'><div class='board'>";
    let start = false;
    for (let i = 0; i < b.length; i++) {
        let char = board.charAt(i);
        if (char === "#" && !start) {
            start = true;
        }
        if (!start) {
            continue;
        }

        if (char === " ") {
            b += "<span class='space'></span>"
        }
        if (char === "#") {
            b += "<span class='wall'></span>"
        }
        if (char === "x") {
            b += "<span class='barrier'></span>"
        }
        if (char === "1") {
            b += "<span class='player1'><p>1</p></span>"
        }
        if (char === "2") {
            b += "<span class='player2'><p>2</p></span>"
        }
        if (char === "*") {
            b += "<span class='trap'><p>*</p></span>"
        }
        if (char === "@") {
            b += "<span class='armor'><p>@</p></span>"
        }
        if (char === "^") {
            b += "<span class='speed'><p>^</p></span>"
        }
        if (char === "!") {
            b += "<span class='bomb'><p>!</p></span>"
        }
        }

    b += "</div></div>"
    return b
}

async function getSeriesData(request, response) {
    let playerId = request.params.playerId;
    let seriesData = await dbGetSeriesWithPlayerId(playerId);
    response.json(seriesData);
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

// given a bot name, get all of the player's information
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

async function dbGetPlayerName(playerId) {
    let result;
    try {
        let statement = 'SELECT botName FROM player WHERE playerId = ?;';
        response = await pool.query(statement, [playerId]);
        result = response[0][0];
    } catch (err) {
        console.log(err);
    }
    return result;
}

// given a series id, get that series
async function dbGetSeriesWithSeriesId(seriesId) {
    let result;
    try {
        let statement = 'SELECT * FROM series WHERE seriesId = ?;';
        response = await pool.query(statement, [seriesId]);
        result = response[0][0];
    } catch (err) {
        console.log(err);
    }
    return result;
}

// given a player id, get all the series that player has played in
async function dbGetSeriesWithPlayerId(playerId) {
    let result;
    try {
        let statement = 'SELECT * FROM series WHERE playerOneId = ? OR playerTwoId = ?;';
        response = await pool.query(statement, [playerId, playerId]);
        result = response[0];
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
        let response = await pool.query('DROP TABLE IF EXISTS series;');
        response = await pool.query('DROP TABLE IF EXISTS account;');
        response = await pool.query('DROP TABLE IF EXISTS script;');
        response = await pool.query('DROP TABLE IF EXISTS player;');

        console.log("Creating new tables...")
        response = await pool.query('CREATE TABLE IF NOT EXISTS player (' +
            'playerId INTEGER PRIMARY KEY AUTO_INCREMENT, ' +
            'botName TEXT, partner1 TEXT, partner2 TEXT, partner3 TEXT,' +
            'elo FLOAT, score FLOAT);');
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
            '    ON DELETE CASCADE,' + 
            'replayLink TEXT,' + 
            'winCount INTEGER);');

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
    let success2 = await initFakeSeriesData();
    console.log("Initialized fake series data: " + success2);
    return success && success2;
}

async function initFakePlayerData() {
    let playerStatement = 'INSERT INTO player (botName, partner1, partner2, elo, score)' +
        ' VALUES (?,?,?,?,?);';
    let fakePlayerData = [
        ['bot1', 'me', 'you', 1000, '10'],
        ['bot2', 'bob', 'john', 2000, '20'],
        ['bot3', 'sam', 'carla', 300, '6.34'],
        ['bot4', 'alex', 'julia', 1542.2, '16.5'],
        ['bot5', '@@@', '$$$$', 100, '2.0'],
    ];
    try {
        for (let i = 0; i < fakePlayerData.length; i++) {
            response = await pool.query(playerStatement, fakePlayerData[i]);
        }
        console.log("initFakePlayerData complete.");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function initFakeSeriesData() {
    let statement = "INSERT INTO series (playerOneId, playerTwoId, seriesWinner, winCount, replayLink)" +
        " VALUES (?,?,?,?, ?);";
    let data = [
        ['1', '2', '2', 4, 'https://tron-gamerunner.s3.amazonaws.com/Round_1_of_120_Bot+or+feed_Botology_1.txt'],
        ['3', '2', '2', 3, 'https://tron-gamerunner.s3.amazonaws.com/Round_1_of_120_ariwoo_jjackso3_3.txt'],
        ['5', '4', '4', 4, 'https://tron-gamerunner.s3.amazonaws.com/Round_1_of_120_ciaBOTta_Scrumpy+diddy_0.txt'],
        ['5', '1', '1', 4, 'https://tron-gamerunner.s3.amazonaws.com/Round_1_of_120_ciaBOTta_Scrumpy+diddy_0.txt']
    ];
    try {
        for (let i = 0; i < data.length; i++) {
            response = await pool.query(statement, data[i]);
        }
        console.log("initFakeSeriesData complete.");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports.testResetDb = async function testResetDb() {
    let result = await resetDb();
    return result;
}

module.exports.testQueryDb = async function testQueryDb() {
    let result = await dbGetAllPlayers();
    // fake data has 5 players
    if (result.length !== 5) {
        return false;
    }

    result = await dbGetPlayer('bot1');
    // check for bot that does exist
    if (result['playerId'] !== 1) {
        return false;
    }

    result = await dbGetPlayer('madeupname');
    // check for bot that does not exist
    if (typeof result !== "undefined") {
        return false;
    }

    result = await dbGetSeriesWithPlayerId('2');
    // check for valid series id
    if (result.length != 2) {
        return false;
    }

    result = await dbGetSeriesWithPlayerId('10');
    if (result.length != 0) {
        return false
    }
    return true;
}

// drop tables, re-create, re-initialize with fake data
async function resetDb() {
    let success = false;
    try {
        let res = await createTables();
        res = await initFakeData();
        console.log("DB successfully reset.");
        success = true;
    } catch (err) {
        console.log(err);
    }
    return success;
}

//resetDb();