const server = require('./../server.js'); 

// Controller handler to handle functionality in home page

// Example for handle a get request at '/' endpoint.

function getLeaderboard(request, response){
  // do any work you need to do, then
  response.render('leaderboard', {title: 'Leaderboard'});
}

module.exports = {
  getLeaderboard
};