const defaultProfilePic = 'https://3.bp.blogspot.com/-s8716PPaDKc/XRwdPiIqNVI/AAAAAAAAByQ/vyRkEvA7Gj4obDQikDsS9tLrdYn37PvqgCLcBGAs/s1600/anon_tron_evolution.jpg';
let leaderboard = document.getElementById('leaderboardBody');

// fetch players from API endpoint
async function fetchPlayers() {
    let res = await fetch('/getPlayers');
    return res.json();
}

// update html page
async function initializeLeaderboard() {
    let playersJson = await fetchPlayers();

    // clear old leaderboard
    while (leaderboard.firstChild) {
        leaderboard.removeChild(leaderboard.firstChild);
    }

    // sort players by descending score
    playersJson = playersJson.sort((a, b) => b['score'] - a['score']);
    
    // add players to leaderboard
    for (let i = 0; i < playersJson.length; i++) {
        let player = playersJson[i];
        let tr = document.createElement('tr');

        // append rank
        let th = document.createElement('th');
        th.setAttribute('scope', 'row');
        th.innerHTML = i;
        tr.appendChild(th);

        // add default image
        let td = document.createElement('td');
        let img = document.createElement('img');
        img.setAttribute('class', 'profile-img');
        img.setAttribute('src', defaultProfilePic);
        td.append(img);
        tr.appendChild(td);

        // create and append table data to table row item
        // if we need to add more attributes to leaderboard, simply add the needed attribute to 
        // this attributes list
        let attributes = ['botName', 'score', 'elo'];
        for (let j = 0; j < attributes.length; j++) {
            let td = document.createElement('td');
            td.innerHTML = player[attributes[j]];
            tr.appendChild(td);
        }

        // append to table
        leaderboard.appendChild(tr);
    }
}

window.onload = initializeLeaderboard;