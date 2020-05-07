let playerIdDiv = document.getElementById('playerIdDiv');
let playerId = playerIdDiv.innerHTML; 
let matchHistory = document.getElementById('matchHistory');
let totalWins = 0;
let totalLosses = 0;
window.document.title = document.getElementById('botName').innerText + "'s Stats";


// fetch series from API endpoint
async function fetchSeries() {
    let res = await fetch('../getSeriesData/' + playerId);
    return res.json();

}

async function fetchPlayers() {
    let res = await fetch('/getPlayers');
    return res.json();
}

function createPlayerDict(playersJson) {
    let dict = {};
    for (let i = 0; i < playersJson.length; i++) {
        dict[playersJson[i]['playerId']] = playersJson[i]['botName'];
    }
    return dict;
}

// update html page
async function initSeriesList() {
    let seriesJson = await fetchSeries();
    // need this to convert playerId -> botName when displaying series
    let playersJson = await fetchPlayers();
    let playerDict = createPlayerDict(playersJson);
    // clear old series list
    while (matchHistory.firstChild) {
        matchHistory.removeChild(matchHistory.firstChild);
    }

    // report number of matches played
    let totalMatches = seriesJson.length;
    // document.getElementById('totalMatches').innerHTML = 'Matches Played: ' + totalMatches;
    document.getElementById('totalMatches').innerHTML =  totalMatches;

    // construct list
    for (let i = 0; i < totalMatches; i++) {
        let series = seriesJson[i];
        let li = document.createElement('li');
        let playerOne = playerDict[series['playerOneId']];
        let playerTwo = playerDict[series['playerTwoId']];
        let winCount = series['winCount'];
        // check if first player won
        let thisIsPlayerOne = series['playerOneId'] === parseInt(playerId);
        let thisPlayerWon = series['seriesWinner'] === parseInt(playerId);
        let matchupString = thisIsPlayerOne ? playerOne + " vs " + playerTwo + " " : playerTwo + " vs " + playerOne+ " ";
        let winString = thisPlayerWon ? "WIN" : "LOSS";
        let winLossString = thisPlayerWon ? winCount + " - " + (5-winCount) : (5-winCount) + " - " + winCount;

        matchString = "<span style=\"color: #FF5722\">" + matchupString + "</span>";
        let winColor = thisPlayerWon ? "style=\"color: #FF5722\"" : "style=\"color: white\"";
        winString = "<span " + winColor +  " >" + winString + "</span>";
        winLossString = "<span style=\"color: #FF5722\">" + winLossString + "</span>";

        let spaceBetween = document.createElement('p');
        spaceBetween.innerHTML = "&nbsp;&nbsp"
        let replayString = document.createElement('p');
        replayString.innerHTML = " <span style='color: #ff5722; border-bottom: 1px solid #ff5722'>" + "MATCH REPLAY" +"</span>";
        // replayString = "    MATCH REPLAY";

        // li.setAttribute('border', '3px dashed #ff5722');
        li.innerHTML = matchString  + winString +  winLossString;
        li.setAttribute('id', 'match');

        //set row as clickable link to player profile
        li.setAttribute('class', 'clickable');
        li.addEventListener("click", async function(event) {
            event.preventDefault();
            window.location = "/series/" + series['seriesId'];
        })

        // append to table
        totalWins += thisPlayerWon ? winCount : 5 - winCount;        
        matchHistory.appendChild(li);
    }

    totalLosses = (totalMatches * 5) - totalWins;
    document.getElementById('totalWins').innerHTML =  totalWins;
    document.getElementById('totalLosses').innerHTML =  totalLosses;
}

window.onload = initSeriesList;