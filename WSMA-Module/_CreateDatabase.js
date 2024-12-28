const WSMainServerInstaller = require('./server/createdatabase.js').WSMainServerInstaller;

const WSMain = new WSMainServerInstaller();
WSMain.Init(true, 3);