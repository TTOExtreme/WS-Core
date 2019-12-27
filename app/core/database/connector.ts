import { createConnection, QueryError, RowDataPacket, mysql } from 'mysql';
import { WSMainServer } from '../main';
import { WSLog } from '../utils/log';

class DBConnector {

    private db: mysql;
    private connected: boolean = false;
    private log: WSLog;

    /**
     * connect: connect to the database
     */
    public connect(WSMain: WSMainServer) {
        this.db = createConnection(WSMain.config.DB);
        this.log = WSMain.log;
    }

    /**
     * query: Execute sql statements and return results
     */
    public query(sql: string) {
        return new Promise((resolve, reject) => {
            this.db.query(sql, (err: QueryError, rows: RowDataPacket[]) => {
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

export { DBConnector }