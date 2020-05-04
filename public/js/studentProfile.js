let playerIdDiv = document.getElementById('playerIdDiv');
let playerId = playerIdDiv.innerHTML; 
let matchHistory = document.getElementById('matchHistory');
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

    // construct list
    for (let i = 0; i < seriesJson.length; i++) {
        let series = seriesJson[i];
        let li = document.createElement('li');
        let playerOne = playerDict[series['playerOneId']];
        let playerTwo = playerDict[series['playerTwoId']];
        let winCount = series['winCount'];
        // check if first player won
        let winnerFirst = series['seriesWinner'] === series['playerOneId'];
        let seriesString = playerOne + " v. " + playerTwo + " ";
        seriesString += winnerFirst ? "(" + winCount + ":" + (5-winCount) + ")" : "(" + (5-winCount) + ":" + winCount + ")";
        li.innerHTML = seriesString;

        //set row as clickable link to player profile
        li.setAttribute('class', 'clickable');
        li.addEventListener("click", async function(event) {
            event.preventDefault();
            window.location = "/series/" + series['seriesId'];
        })

        // append to table
        matchHistory.appendChild(li);
    }
}
window.onload = initSeriesList;