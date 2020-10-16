/**
 * Group Data Instance
 */
const GroupStruct = require('../structures/main/GroupStruct').GroupStruct;
const WSMainServer = require('../../../main');

/**
 * @typedef Group
 */
class Group {

    /**@const {WSLog} log */
    log;
    /**@const {WSCfg} cfg */
    cfg;
    /**@const {DBConnector} db */
    db;

    //data da ultima atualização de permissões
    lastPermLoad;

    /**
     * delay for reload permissions in milliseconds
     * for reload permissions is necessary to create an action from client
     */
    delayPermLoad = 10 * 1000;

    /**
     * Constructor for User Class
     * @param {WSMainServer} WSMain
     */
    constructor(WSMain) {
        this.db = WSMain.db;
        this.log = WSMain.log;
        this.cfg = WSMain.cfg;
        this._events = WSMain.events;
        this._AdmMenus = WSMain.AdmMenus;
    }

    myself = new GroupStruct();


    findmeid(groupID) {
        if (!groupID) {
            this.log.warning("Group ID is Null");
            return Promise.reject("ID do Grupo é nulo")
        }
        return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._Group WHERE id='" + groupID + "' AND active=1;")
            .catch((err) => {
                return Promise.reject("Wrong GroupID: <" + groupID + ">.");
            }).then((result) => {
                if (result[0]) {
                    this.myself = new GroupStruct(result[0]);
                    return this._loadPermissions();
                } else {
                    return Promise.reject();
                }
            }).catch((err) => {
                if (!err) this.log.info("Not Found group: <" + groupID + "> in database.");
                if (err) this.log.error(err);
                return Promise.reject("ID do Grupo Incorreto");
            }).then((result) => {
                this.log.info("Found user: <" + groupID + "> in database.");
                return Promise.resolve(result)
            })

    }

    /**
     * Function to Check if user has certain permission;
     * @param {String} permissionCode 
     */
    checkPermission(permissionCode) {
        if (this.lastPermLoad + this.delayPermLoad < Date.now()) {
            this.lastPermLoad = Date.now() + this.delayPermLoad;
            this._loadPermissions().then(() => {
                return this.checkPermission(permissionCode);
            })
        } else {
            if (this.checkPermissionSync(permissionCode)) {
                return Promise.resolve();
            } else {
                if (!this.checkPermissionSync("dev/usr/login")) {
                    this.LogOut(); //create a logout in case the user is blocked
                }
                return Promise.reject("Usuário sem permissão para a ação");
            }
        }
    }

    /**
     * Function to Check if user has certain permission Sync;
     * @param {String} permissionCode 
     */
    checkPermissionSync(permissionCode) {
        if (this.myself.permissions) {
            if (this.myself.permissions.filter(perm => (perm.code_Permission === permissionCode & perm.active === 1))[0] != undefined ||
                this.myself.permissions.filter(perm => (perm.code_Permission === "adm/system" & perm.active === 1))[0] != undefined) {
                return true;
            }
        }
        return false;
    }

    /**
     * Function to load permissions from database
     * @param {JSON} preferences 
     */
    _loadPermissions() {
        if (this.myself.id) {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT *  FROM " + this.db.DatabaseName + "._Permissions AS P" +
                    " LEFT JOIN " +
                    " (SELECT " +
                    " ut1.username as createdBy," +
                    " ut2.username as deactivatedBy," +
                    " up1.active," +
                    " up1.code_Permission," +
                    " up1.createdIn," +
                    " up1.deactivatedIn," +
                    " up1.id_group" +
                    " FROM " + this.db.DatabaseName + ".rlt_Group_Permissions as up1" +
                    " LEFT JOIN WS_CORE_1_3_1._User as ut1 on up1.createdBy=ut1.id" +
                    " LEFT JOIN WS_CORE_1_3_1._User as ut2 on up1.deactivatedBy=ut2.id" +
                    " WHERE id_Group=" + this.myself.id + " ) AS UP" +
                    " ON P.code = UP.code_Permission;"
                ).then((result) => {
                    if (result[0]) {
                        this.myself.permissions = result;
                        resolve(this.myself)
                    } else {
                        return Promise.reject();
                    }
                }).catch(() => {
                    this.log.error("Group Without Any Permissions " + this.myself.toString())
                    reject("Group Without Any Permissions");
                })
            });
        } else {
            this.log.error("Group not defined to load Permissions\n" + this.myself.toString())
            return Promise.reject("Group not defined to load Permissions");
        }
    }

    /**
     * Function to load permissions from database
     * @param {JSON} preferences 
     */
    _loadGroupTree(id) {
        if (id || this.myself.id) {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT" +
                    " G.id_Group_Father," +
                    " G.id_Group_Child," +
                    " G.active," +
                    " GP.code_Permission," +
                    " GP.id_Group as ID_grp_Perm" +
                    " FROM " + this.db.DatabaseName + ".rlt_Group_Group as G" +
                    " LEFT JOIN " + this.db.DatabaseName + ".rlt_Group_Permissions as GP" +
                    " ON G.id_Group_Child = GP.id_Group" +
                    " WHERE G.id_Group_Child = " + ((id != null) ? id : this.myself.id) + ";"
                ).then((result) => {
                    if (result[0]) {
                        result.forEach(group => {
                            if (!this.myself.groups.find(gpind => (gpind.id == group["id_Group_Child"]))) {
                                console.log("added: " + subgroupPerm.id);
                                subgroupPerm.permissions = this._loadPermissions(subgroupPerm.id);
                                this.myself.groups.push(subgroupPerm);
                            }
                        });
                        this.myself.permissions = result;
                        resolve(this.myself)
                    } else {
                        return Promise.resolve();
                    }
                }).catch(() => {
                    this.log.error("Group Without Any Permissions " + this.myself.toString())
                    reject("Group Without Any Permissions");
                })
            });
        } else {
            this.log.error("Group not defined to load Permissions\n" + this.myself.toString())
            return Promise.reject("Group not defined to load Permissions");
        }
    }

    /**
     * Return list of permissions enabled for user 
     */
    listPermissions() {
        return this.myself.permissions;
    }

    /**
     * Return list of permissions enabled for user 
     */
    listGroups() {
        return this.myself.groups;
    }

}

module.exports = {
    Group
};