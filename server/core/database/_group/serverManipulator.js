/**
 * Instance for manipulating user on server side
 */

const Group = require("./class_group");
const GroupStructure = require("../structures/main/GroupStruct")

class GroupServer {

    /**
     * Constructor for UserServer Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMain) {
        this.db = WSMain.db;
        this.log = WSMain.log;
        this.cfg = WSMain.cfg;
    }


    /**
     * Create GROUP from JSON Struct
     * @param {JSON} group {id,name,username,pass,active}
     * @returns {Promise}
     */

    createGroupJson(group) {
        return this.createGroup(group.id, group.name, group.active)
    }

    /**
     * Create group
     * @param {Int} id 
     * @param {String} name 
     * @param {String} username 
     * @param {String} pass 
     * @param {Boolean} active 
     * @param {Int} myselfID 
     * @returns {Promise}
     */
    createGroup(id, name, active, myselfID = 1) {

        return this.db.query("INSERT INTO " + this.db.DatabaseName + "._Group" +
            " (" + ((id != undefined) ? "id," : "") + "name,active,createdBy,createdIn)" +
            " VALUES " +
            " (" + ((id != undefined) ? id + "," : "") + "'" + name + "'," + ((active) ? 1 : 0) + "," + myselfID + "," + Date.now() + ");");
    }

    /**
     * Edit group
     * @param {Int} id 
     * @param {String} name 
     * @param {Boolean} active 
     * @param {Int} myselfID 
     * @returns {Promise}
     */
    edtGroup(id, name, active, myselfID = 1) {

        return this.db.query("UPDATE " + this.db.DatabaseName + "._Group" +
            " SET name='" + name + ((active != undefined) ? "', active=" + ((active) ? 1 : 0) + "," : "',") + " modifiedBy=" + myselfID + ", modifiedIn=" + Date.now() + "" +
            " WHERE id=" + id + "");
    }

    /**
     * List all Groups
     */
    listGroup() {
        return this.db.query("SELECT " +
            " U1.id," +
            " U1.name," +
            " U1.createdIn," +
            " U2.username as createdBy," +
            " U1.modifiedIn," +
            " U3.username as modifiedBy," +
            " U1.deactivatedIn," +
            " U1.deactivatedBy," +
            " U1.active" +
            " FROM " + this.db.DatabaseName + "._Group as U1 " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U2 " +
            " ON U1.createdBy = U2.id " +
            " LEFT JOIN " + this.db.DatabaseName + "._User as U3 " +
            " ON U1.modifiedBy = U3.id " +
            " ;");
    }

    /**
     * Deactivated permission to group
     * @param {Int} groupID groupId a ser adicionado
     * @param {Int} permissionID 
     * @param {Int} myId UserID que adicionou a permissão
     * @returns {Promise}
     */
    attribPermissions(groupID, permissionCode, myId, active) {
        return this.checkPermissionGroup(groupID, permissionCode).then(res => {
            if (res.length == 0) {
                return this.db.query("INSERT INTO " + this.db.DatabaseName + ".rlt_Group_Permissions" +
                    " (id_Group,code_Permission,deactivatedBy,deactivatedIn,active) VALUES (" + groupID + ",'" + permissionCode + "'," + myId + "," + Date.now() + "," + active + ");");
            } else {
                return this.db.query("UPDATE " + this.db.DatabaseName + ".rlt_Group_Permissions SET " +
                    ((active == 1) ?
                        " active=1, deactivatedBy=NULL, createdBy=" + myId + ", createdIn=" + Date.now() + ", deactivatedIn=NULL" :
                        " active=0, deactivatedBy=" + myId + ", deactivatedIn=" + Date.now()) +
                    " WHERE id_Group = " + groupID + " AND code_Permission = '" + permissionCode + "';"
                );
            }
        });
    }

    /**
     * Deactivated permission to group
     * @param {Int} groupID id do grupo Pai
     * @param {Int} Id_Group id do grupo Filho 
     * @param {Int} myId UserID que adicionou a permissão
     * @returns {Promise}
     */
    attribGroup(groupID, Id_Group, myId, active) {
        return this.checkGroupGroup(groupID, Id_Group).then(res => {
            if (res.length == 0) {
                return this.db.query("INSERT INTO " + this.db.DatabaseName + ".rlt_Group_Permissions" +
                    " (id_Group,code_Permission,deactivatedBy,deactivatedIn,active) VALUES (" + groupID + ",'" + permissionCode + "'," + myId + "," + Date.now() + "," + active + ");");
            } else {
                return this.db.query("UPDATE " + this.db.DatabaseName + ".rlt_Group_Permissions SET " +
                    ((active == 1) ?
                        " active=1, deactivatedBy=NULL, createdBy=" + myId + ", createdIn=" + Date.now() + ", deactivatedIn=NULL" :
                        " active=0, deactivatedBy=" + myId + ", deactivatedIn=" + Date.now()) +
                    " WHERE id_Group = " + groupID + " AND code_Permission = '" + permissionCode + "';"
                );
            }
        });
    }

    checkPermissionGroup(groupID, permissionCode) {
        return this.db.query("SELECT * FROM " + this.db.DatabaseName + ".rlt_Group_Permissions" +
            " WHERE id_Group=" + groupID + " AND code_Permission='" + permissionCode + "';");
    }

    checkGroupGroup(groupID, Id_Group) {
        return this.db.query("SELECT * FROM " + this.db.DatabaseName + ".rlt_Group_Group" +
            " WHERE id_Group_Father=" + groupID + " AND id_Group_Child='" + Id_Group + "';");
    }
}

module.exports = {
    GroupServer
}