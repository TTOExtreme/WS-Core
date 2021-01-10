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
        return this.createUser(user.id, user.name, user.username, user.password, user.email, user.telefone, user.active)
    }

    /**
     * Create user
     * @param {Int} id 
     * @param {String} name 
     * @param {String} username 
     * @param {String} pass 
     * @param {Boolean} active 
     * @param {Int} myselfID 
     * @returns {Promise}
     */
    createUser(id, name, username, pass, email, telefone, active, myselfID = 1) {
        const salt = this.bcypher.generate_salt();
        this.log.warning("User With SHA512 Pass: " + this.bcypher.sha512(pass))

        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._User" +
            " (" + ((id != undefined) ? "id," : "") + "name,username,email,telefone,password,salt,active,createdBy,createdIn)" +
            " VALUES " +
            " (" + ((id != undefined) ? id + "," : "") + "'" + name + "','" + username + "','" + email + "','" + telefone + "','" + this.bcypher.sha512(salt + this.bcypher.sha512(pass)) + "','" + salt + "'," + ((active) ? 1 : 0) + "," + myselfID + "," + Date.now() + ");");
    }

    /**
     * Edit user
     * @param {Int} id 
     * @param {String} name 
     * @param {String} pass 
     * @param {Boolean} active 
     * @param {Int} myselfID 
     * @returns {Promise}
     */
    edtUser(id, name, pass, active, myselfID = 1) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._User" +
            " SET name='" + name + ((active != undefined) ? "', active=" + ((active) ? 1 : 0) : "") + ", modifiedBy=" + myselfID + ", modifiedIn=" + Date.now() + "" +
            " WHERE id=" + id + "");
    }

    /**
     * List all Users
     */
    listUser() {
        return this.db.query("SELECT " +
            "U1.id," +
            "U1.name," +
            "U1.username," +
            "U1.email," +
            "U1.telefone," +
            "U1.createdIn," +
            "U2.username as createdBy," +
            "U1.modifiedIn," +
            "U3.username as modifiedBy," +
            "U1.deactivatedIn," +
            "U1.deactivatedBy," +
            "U1.active," +
            "U1.connected," +
            "U1.lastConnection," +
            "U1.lastTry," +
            "U1.lastIp " +
            "FROM " + this.db.DatabaseName + "._User as U1 " +
            "LEFT JOIN " + this.db.DatabaseName + "._User as U2 " +
            "ON U1.createdBy = U2.id " +
            "LEFT JOIN " + this.db.DatabaseName + "._User as U3 " +
            "ON U1.modifiedBy = U3.id " +
            " ;");
    }

    /**
     * Deactivated permission to user
     * @param {Int} userID UserId a ser adicionado
     * @param {Int} permissionID 
     * @param {Int} myId UserID que adicionou a permissão
     * @returns {Promise}
     */
    attribPermissions(userID, permissionCode, myId, active) {
        return this.checkPermissionUser(userID, permissionCode).then(res => {
            if (res.length == 0) {
                return this.db.query("INSERT INTO " + this.db.DatabaseName + ".rlt_User_Permissions" +
                    " (id_User,code_Permission,deactivatedBy,deactivatedIn,active) VALUES (" + userID + ",'" + permissionCode + "'," + myId + "," + Date.now() + "," + active + ");");
            } else {
                return this.db.query("UPDATE " + this.db.DatabaseName + ".rlt_User_Permissions SET " +
                    ((active == 1) ?
                        " active=1, deactivatedBy=NULL, createdBy=" + myId + ", createdIn=" + Date.now() + ", deactivatedIn=NULL" :
                        " active=0, deactivatedBy=" + myId + ", deactivatedIn=" + Date.now()) +
                    " WHERE id_User = " + userID + " AND code_Permission = '" + permissionCode + "';"
                );
            }
        });
    }

    /**
     * Deactivated permission to user
     * @param {Int} UserId id do Usuario a ser atribuido
     * @param {Int} Id_Group id do grupo
     * @param {Int} myId UserID que adicionou o Grupo
     * @returns {Promise}
     */
    attribGroup(UserID, Id_Group, myId, active) {
        return this.checkGroupUser(UserID, Id_Group).then(res => {
            if (res.length == 0) {
                return this.db.query(
                    "INSERT INTO " + this.db.DatabaseName + ".rlt_User_Group" +
                    " (id_Group,id_User,createdBy,createdIn,active) VALUES (" +
                    Id_Group + "," + UserID + "," + myId + "," + Date.now() + "," + active + ");");
            } else {
                console.log("UPDATE " + this.db.DatabaseName + ".rlt_User_Group SET " +
                    ((active == 1) ?
                        " active=1, deactivatedBy=NULL, modifiedBy=" + myId + ", modifiedIn=" + Date.now() + ", deactivatedIn=NULL" :
                        " active=0, deactivatedBy=" + myId + ", deactivatedIn=" + Date.now() + "") +
                    " WHERE id_User = " + UserID + " AND id_Group = " + Id_Group + ";");
                return this.db.query("UPDATE " + this.db.DatabaseName + ".rlt_User_Group SET " +
                    ((active == 1) ?
                        " active=1, deactivatedBy=NULL, modifiedBy=" + myId + ", modifiedIn=" + Date.now() + ", deactivatedIn=NULL" :
                        " active=0, deactivatedBy=" + myId + ", deactivatedIn=" + Date.now() + "") +
                    " WHERE id_User = " + UserID + " AND id_Group = " + Id_Group + ";"
                );
            }
        });
    }


    checkPermissionUser(userID, permissionCode) {
        return this.db.query("SELECT * FROM " + this.db.DatabaseName + ".rlt_User_Permissions" +
            " WHERE id_User=" + userID + " AND code_Permission='" + permissionCode + "';");
    }

    checkGroupUser(UserID, Id_Group) {
        return this.db.query("SELECT * FROM " + this.db.DatabaseName + ".rlt_User_Group" +
            " WHERE id_User=" + UserID + " AND id_Group='" + Id_Group + "';");
    }
}

module.exports = {
    UserServer
}