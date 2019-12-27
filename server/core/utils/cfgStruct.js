
class WSConfigStruct {
    webPort = 8080;
    webpageFolder = "/opt/WS-Core/web";
    version = "1.3.1";
    DB = {
        host: "localhost",
        user: "WSCore",
        password: "TTO@ws2019",
        database_name: "WS_Core"
    }
}

module.exports = { WSConfigStruct }