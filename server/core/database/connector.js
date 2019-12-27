const mysql = require('mysql');

class DBConnector {

    db;
    connected = false;
    log;

    /**
     * connect: connect to the database
     */
    connect(WSMain) {
        this.db = mysql.createConnection(WSMain.config.DB);
        this.log = WSMain.log;
    }

    /**
     * query: Execute sql statements and return results
     */
    query(sql) {
        return new Promise((resolve, reject) => {
            this.db.query(sql, (err, rows) => {
                if (err) {
                    this.log.error("SQL ERROR:" + "\n\t" +
                        "ERR CODE: " + err.code + "\n\t" +
                        "ERR ERRNO: " + err.errno + "\n\t" +
                        "ERR FATAL: " + err.fatal + "\n\t" +
                        "ERR SQL: " + err.sql + "\n\t" +
                        "ERR SQL State: " + err.sqlState + "\n\t" +
                        "ERR SQL Mess: " + err.sqlMessage + "\n\t" +
                        "");
                    reject(err.sqlMessage)
                }
                let data = [];
                if (rows.length > 0)
                    rows.forEach(element => {
                        data.push(JSON.parse(JSON.stringify(element)));
                    });
                resolve(data);
            })
        })
    }

}

module.exports = { DBConnector }