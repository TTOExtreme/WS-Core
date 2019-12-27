const WSMainServer = require('./server/main.js').WSMainServer;

const WSMain = new WSMainServer();
WSMain.Init(true, 3);