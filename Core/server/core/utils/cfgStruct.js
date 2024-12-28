
class WSConfigStruct {
    webPort = 8080;
    webHost = "localhost";
    webpageFolder = "/opt/WS-Core/web";
    version = "1.3.1";
    adminPage = "/Administrativo";
    DB = {
        host: "localhost",
        user: "WSCore",
        password: "TTO@ws2019",
        database_name: "WS_Core"
    }
}

module.exports = { WSConfigStruct }