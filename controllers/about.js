const server = require('./../server.js'); 

// Controller handler to handle functionality in home page

// Example for handle a get request at '/' endpoint.

function getAbout(request, response){
  // do any work you need to do, then
  response.render('about', {title: 'About'});
}

module.exports = {
  getAbout
};