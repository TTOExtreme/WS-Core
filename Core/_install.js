const WSMainServerInstaller = require('./server/install.js').WSMainServerInstaller;

const WSMain = new WSMainServerInstaller();
WSMain.Init(true, 3);