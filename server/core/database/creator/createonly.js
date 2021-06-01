const fs = require('fs');

class DatabaseCreator {

    _version;
    _db;
    _log;

    databasename;

    constructor(WSMain) {
        this.version = WSMain.config.version;
        this.db = WSMain.db;
        this.log = WSMain.log;
        this.log.info((this.version).replace(".", "_").replace(".", "_").replace(".", "_"))
        this.UserManupulator = new (require("../_user/serverManipulator")).UserServer(WSMain);
    }

    creatDatabase() {
        return new Promise((res, rej) => {
            this.databasename = "WS_CORE_" + this.version.replace(".", "_").replace(".", "_").replace(".", "_");
            this.db.query("CREATE DATABASE IF NOT EXISTS " + this.databasename + ";")
                .catch((err) => {
                    this.log.error("Error on Drop Database: \n" + (err).toString())
                    rej();
                })
        }).catch((err) => {
            this.log.error("Error on creating Database: \n" + (err).toString() + "\n" + "CREATE DATABASE IF NOT EXISTS " + this.databasename + ";")
            rej(err);
        }).then(() => {
            this.log.warning("Created Database.")
            this._CreateTables().then(() => {
                res();
            }).catch(() => {
                rej();
            });
        })
    }

    _CreateTables() {
        return new Promise((res, rej) => {
            let structs = fs.readdirSync(__dirname + '/../structures/main/')
            let arr = [];
            structs.forEach((table) => {
                let tablename = "_" + table.replace(".js", "").replace("Struct", "");
                let sql = "CREATE TABLE IF NOT EXISTS " + this.databasename + "." + tablename + " (";

                this.log.info("Reading Structure From : " + table);
                let str = require(__dirname + '/../structures/main/' + table)._DB;
                this.log.info("Structure Readed");
                //this.log.info("Structure Readed : " + JSON.stringify(str));
                if (str) {
                    Object.keys(str).forEach((col) => {
                        sql += col + " " + str[col] + ", "
                    })
                    sql = sql.substr(0, sql.length - 2);
                    sql += ");"
                    arr.push(this.db.query(sql)
                        .catch((err) => {
                            this.log.error(err);
                        }).then(() => {
                            this.log.warning("Created Table: " + tablename);
                        }));
                } else {
                    this.log.error("Structure Undefined for: " + table);
                    rej();
                }
            })
            Promise.all(arr).then(() => {
                res();
            }).catch(() => {
                rej();
            })
        }).then(() => {
            return this._CreateRelationsTables();
        })
    }

    _CreateRelationsTables() {
        return new Promise((res, rej) => {
            let structs = fs.readdirSync(__dirname + '/../structures/relations/')
            let arr = [];
            structs.forEach((table) => {
                let tablename = "rlt_" + table.replace(".js", "").replace("Struct", "");
                let sql = "CREATE TABLE IF NOT EXISTS " + this.databasename + "." + tablename + " (";

                this.log.info("Reading Structure From : " + table);
                let str = require(__dirname + '/../structures/relations/' + table)._DB;
                this.log.info("Structure Readed");
                //this.log.info("Structure Readed : " + JSON.stringify(str));
                if (str) {
                    Object.keys(str).forEach((col) => {
                        sql += col + " " + str[col] + ", "
                    })
                    sql = sql.substr(0, sql.length - 2);
                    sql += ");"
                    console.log(sql);
                    arr.push(this.db.query(sql)
                        .catch((err) => {
                            this.log.error(err);
                        }).then(() => {
                            this.log.warning("Created Table: " + tablename);
                        }));
                } else {
                    this.log.error("Structure Undefined for: " + table);
                    rej();
                }
            })
            Promise.all(arr).then(() => {
                res();
            }).catch(() => {
                rej();
            })
        }).then(() => {
            return this._PopulateDatabase();
        });
    }

    _PopulateDatabase() {
        return new Promise((res, rej) => {
            let datas = fs.readdirSync(__dirname + '/../structures/data/')

            const excludeTables = "_Permissions,"
            let arr = [];
            datas.forEach((table) => {
                let tablename = "_" + table.replace(".js", "").replace("Create", "");
                if (table.indexOf("_") > -1) { tablename = "rlt_" + table.replace(".js", "").replace("Create", "") }
                let sql = "INSERT INTO " + this.databasename + "." + tablename + " ";

                this.log.info("Reading Structure From : " + table);
                let str = require(__dirname + '/../structures/data/' + table)._DB;
                this.log.info("Structure Readed");
                //this.log.info("Structure Readed : " + JSON.stringify(str));
                if (tablename == "_User") {
                    if (str) {
                        if (str.length > 0) {
                            //Append All Data
                            str.forEach(item => {
                                this.UserManupulator.createUserJson(item)
                            })
                        }
                    }
                } else {
                    if (str) {
                        if (str.length > 0) {
                            //Create Structure
                            sql += "("
                            Object.keys(str[0]).forEach((col) => {
                                sql += col + ", "
                            })
                            sql = sql.substr(0, sql.length - 2);
                            if (excludeTables.indexOf(tablename) == -1)
                                sql += ",createdBy,createdIn"
                            sql += ") VALUES "

                            //Append All Data
                            str.forEach(item => {
                                sql += "("
                                Object.keys(item).forEach((col) => {
                                    sql += "'" + item[col] + "', "
                                })
                                sql = sql.substr(0, sql.length - 2);
                                if (excludeTables.indexOf(tablename) == -1)
                                    sql += ",1," + Date.now();
                                sql += "), "
                            })
                            sql = sql.substr(0, sql.length - 2);
                            arr.push(this.db.query(sql)
                                .catch((err) => {
                                    this.log.error(err);
                                }).then(() => {
                                    this.log.warning("Added Data: " + tablename);
                                    return Promise.resolve();
                                }));
                        }
                    } else {
                        this.log.error("Structure Undefined for: " + table);
                        rej();
                    }
                }
            })
            Promise.all(arr).then(() => {
                res();
            }).catch(() => {
                rej();
            })
        }).then(() => {
            return Promise.resolve();
        });
    }

}
module.exports = { DatabaseCreator }