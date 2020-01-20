const fs = require('fs');

class DatabaseCreator {

    _version;
    _db;
    _log;

    _databasename;

    constructor(WSMain) {
        this.version = WSMain.config.version;
        this.db = WSMain.db;
        this.log = WSMain.log;
        this.log.info((this.version).replace(".", "_").replace(".", "_").replace(".", "_"))
    }

    creatDatabase() {
        this.databasename = "WS_CORE_" + this.version.replace(".", "_").replace(".", "_").replace(".", "_");
        this.db.query("DROP DATABASE IF EXISTS " + this.databasename + ";")
            .then(() => {
                this.log.warning("Droped Database.")
                this.db.query("CREATE DATABASE IF NOT EXISTS " + this.databasename + ";")
                    .catch((err) => {
                        this.log.error("Error on Drop Database: \n" + (err).toString())
                    })
            }).then(() => {
                this.log.warning("Created Database.")
                this._CreateTables();
            }).catch((err) => {
                this.log.error("Error on creating Database: \n" + (err).toString())
            })

    }

    _CreateTables() {
        let structs = fs.readdirSync(__dirname + '/../structures/main/')
        structs.forEach((table) => {
            let tablename = "_" + table.replace(".js", "").replace("Struct", "");
            let sql = "CREATE TABLE IF NOT EXISTS " + this.databasename + "." + tablename + " (";

            this.log.info("Reading Structure From : " + table);
            let str = require(__dirname + '/../structures/main/' + table)._DB;
            this.log.info("Structure Readed : " + JSON.stringify(str));
            if (str) {
                Object.keys(str).forEach((col) => {
                    sql += col + " " + str[col] + ", "
                })
                sql = sql.substr(0, sql.length - 2);
                sql += ");"
                this.db.query(sql)
                    .then(() => {
                        this.log.warning("Created Table: " + tablename)
                    }).catch((err) => {

                    })
            } else {
                this.log.error("Structure Undefined for: " + table);
            }
        })
        this._CreateRelationsTables();
    }

    _CreateRelationsTables() {
        let structs = fs.readdirSync(__dirname + '/../structures/relations/')
        structs.forEach((table) => {
            let tablename = "rlt_" + table.replace(".js", "").replace("Struct", "");
            let sql = "CREATE TABLE IF NOT EXISTS " + this.databasename + "." + tablename + " (";

            this.log.info("Reading Structure From : " + table);
            let str = require(__dirname + '/../structures/relations/' + table)._DB;
            this.log.info("Structure Readed : " + JSON.stringify(str));
            if (str) {
                Object.keys(str).forEach((col) => {
                    sql += col + " " + str[col] + ", "
                })
                sql = sql.substr(0, sql.length - 2);
                sql += ");"
                this.db.query(sql)
                    .then(() => {

                        this.log.warning("Created Table: " + tablename)
                    }).catch((err) => {

                    })
            } else {
                this.log.error("Structure Undefined for: " + table);
            }
        })
    }

    _PopulateDatabase() {
        let datas = fs.readdirSync(__dirname + '/../structures/data/')
        datas.forEach((table) => {
            let tablename = "" + table.replace(".js", "").replace("Struct", "");
            let sql = "CREATE TABLE IF NOT EXISTS " + this.databasename + "." + tablename + " (";

            this.log.info("Reading Structure From : " + table);
            let str = require(__dirname + '/../structures/data/' + table)._DB;
            this.log.info("Structure Readed : " + JSON.stringify(str));
            if (str) {
                Object.keys(str).forEach((col) => {
                    sql += col + " " + str[col] + ", "
                })
                sql = sql.substr(0, sql.length - 2);
                sql += ");"
                this.db.query(sql)
                    .then(() => {

                        this.log.warning("Created Table: " + tablename)
                    }).catch((err) => {

                    })
            } else {
                this.log.error("Structure Undefined for: " + table);
            }
        })
    }

}
module.exports = { DatabaseCreator }