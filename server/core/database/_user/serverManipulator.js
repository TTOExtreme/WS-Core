/**
 * Instance for manipulating user on server side
 */

const User = require("./class_user");
const UserStructure = require("../structures/main/UserStruct")
const Bcypher = require("../../utils/bcypher").Bcypher;

class UserServer {

    /**
    * Constructor for UserServer Class
    * @param {WSMainServer} WSMain
    */
    constructor(WSMain) {
        this.db = WSMain.db;
        this.log = WSMain.log;
        this.cfg = WSMain.cfg;
        this.bcypher = new Bcypher();
    }


    /**
     * Create User from JSON Struct
     * @param {JSON} user  {id,name,username,pass,active}
     * @returns {Promise}
     */

    createUserJson(user) {
        return this.createUser(user.id, user.name, user.username, user.password, user.active)
    }

    /**
     * Create user
     * @param {Int} id 
     * @param {String} name 
     * @param {String} username 
     * @param {String} pass 
     * @param {Boolean} active 
     * @returns {Promise}
     */
    createUser(id = undefined, name, username, pass, active = true) {
        const salt = this.bcypher.generate_salt();
        this.log.warning("User With SHA512 Pass: " + this.bcypher.sha512(pass))

        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._User" +
            " (" + ((id != undefined) ? "id," : "") + "name,username,password,salt,active,createdBy,createdIn)" +
            " VALUES " +
            " (" + ((id != undefined) ? id + "," : "") + "'" + name + "','" + username + "','" + this.bcypher.sha512(salt + this.bcypher.sha512(pass)) + "','" + salt + "'," + ((active) ? 1 : 0) + ",1," + Date.now() + ");");
    }

    /**
     * List all Users
     */
    listUser() {
        return this.db.query("SELECT " +
            "U1.id," +
            "U1.name," +
            "U1.username," +
            "U1.createdIn," +
            "U2.username as createdBy," +
            "U1.deactivatedIn," +
            "U1.deactivatedBy," +
            "U1.active," +
            "U1.connected," +
            "U1.lastConnection," +
            "U1.lastTry," +
            "U1.lastIp " +
            "FROM " + this.db.DatabaseName + "._User as U1 LEFT JOIN " +
            " " + this.db.DatabaseName + "._User as U2 " +
            "ON U1.createdBy = U2.id " +
            " ;");
    }

    /**
     * Attrib permission to user
     * @param {Int} userID UserId a ser adicionado
     * @param {Int} permissionID 
     * @param {Int} myId UserID que adicionou a permissão
     * @returns {Promise}
     */
    attribPermissions(userID, permissionID, myId) {
        return this.db.query("INSERT INTO " + this.db.DatabaseName + ".rlt_User_Permissions" +
            " (id_User,id_Permission,createdBy,createdIn,active) VALUES (" + userID + "," + permissionID + "," + myId + "," + Date.now() + ",1));");

    }

    /**
     * Deactivated permission to user
     * @param {Int} userID UserId a ser adicionado
     * @param {Int} permissionID 
     * @param {Int} myId UserID que adicionou a permissão
     * @returns {Promise}
     */
    attribPermissions(userID, permissionID, myId) {
        return this.checkPermissionUser(userID, permissionID).then(res => {
            if (res.length == 0) {
                this.db.query("INSERT INTO " + this.db.DatabaseName + ".rlt_User_Permissions" +
                    " (id_User,id_Permission,deactivatedBy,deactivatedIn,active) VALUES (" + userID + "," + permissionID + "," + myId + "," + Date.now() + ",0));");
            } else {
                this.db.query("UPDATE " + this.db.DatabaseName + ".rlt_User_Permissions" +
                    " WHERE id_User,id_Permission,deactivatedBy,deactivatedIn,active) VALUES (" + userID + "," + permissionID + "," + myId + "," + Date.now() + ",0));");
            }
        });

    }

    checkPermissionUser(userID, permissionID) {
        return this.db.query("SELECT * FROM " + this.db.DatabaseName + ".rlt_User_Permissions" +
            " WHERE 'id_User'=" + userID + " AND 'id_Permission'=" + permissionID + ";");
    }
}

module.exports = { UserServer }