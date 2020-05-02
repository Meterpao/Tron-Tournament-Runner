const server = require ('./../server.js');

test('reset database', () => {
    expect(server.testResetDb()).toBeTruthy();
  });

  
test('query database', () => {
    expect(server.testQueryDb()).toBeTruthy();
  });