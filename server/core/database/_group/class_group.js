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
        this.Menus = [new ClientMenus()]
        this.db = WSMain.db;
        this.log = WSMain.log;
        this.cfg = WSMain.cfg;
        this.bcypher = new Bcypher();
        this._events = WSMain.events;
        this._AdmMenus = WSMain.AdmMenus;
    }

    myself = new GroupStruct();


    findme(groupID) {
        if (!groupID) {
            this.log.warning("Group ID is Null");
            return Promise.reject("ID do Grupo é nulo")
        }
        return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._Group WHERE ID_group='" + username + "' AND active=1;").then((result) => {
            const salt = result[0].salt;
            return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._User WHERE username='" + username + "' AND password='" + this.bcypher.sha512(salt + pass) + "' AND active=1;")
                .catch((err) => {
                    return Promise.reject("Wrong Password: <" + username + ">.");
                }).then((result) => {
                    if (result[0]) {
                        this.myself = new UserStruct(result[0]);
                        return this.resetUUID()
                            .then(() => {
                                return this._loadPermissions();
                                return Promise.resolve(this.myself)
                            }).catch((err) => {
                                this.log.error(err);
                                return Promise.reject("Not Able to reset UUID for user: <" + username + "> in database.");
                            })
                    } else {
                        return Promise.reject();
                    }
                })
        }).catch((err) => {
            if (!err) this.log.info("Not Found user: <" + username + "> in database.");
            if (err) this.log.error(err);
            return Promise.reject("Usuario ou senha incorreto");
        }).then((result) => {
            this.log.info("Found user: <" + username + "> in database.");
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
        SELECT * FROM WS_CORE_1_3_1._Permissions AS P 
        LEFT JOIN (SELECT 
        ut1.username as createdBy,ut2.username as deactivatedBy, up1.active,up1.code_Permission, up1.createdIn,up1.deactivatedIn,up1.id_User
        FROM WS_CORE_1_3_1.rlt_User_Permissions as up1 
        LEFT JOIN WS_CORE_1_3_1._User as ut1 on up1.createdBy=ut1.id
        LEFT JOIN WS_CORE_1_3_1._User as ut2 on up1.deactivatedBy=ut2.id
        WHERE id_User = 1) AS UP 
        ON P.code = UP.code_Permission;
     * 
     * Function to load permissions from database
     * @param {JSON} preferences 
     */
    _loadPermissions() {
        if (this.myself.id) {
            return new Promise((resolve, reject) => {
                this.db.query("SELECT *  FROM " + this.db.DatabaseName + "._Permissions AS P" +
                    " LEFT JOIN " +
                    " (SELECT " +
                    " ut1.username as createdBy,ut2.username as deactivatedBy, up1.active,up1.code_Permission, up1.createdIn,up1.deactivatedIn,up1.id_User" +
                    " FROM " + this.db.DatabaseName + ".rlt_User_Permissions as up1" +
                    " LEFT JOIN WS_CORE_1_3_1._User as ut1 on up1.createdBy=ut1.id" +
                    " LEFT JOIN WS_CORE_1_3_1._User as ut2 on up1.deactivatedBy=ut2.id" +
                    " WHERE id_User=" + this.myself.id + " ) AS UP" +
                    " ON P.code = UP.code_Permission;"
                ).then((result) => {
                    if (result[0]) {
                        this.myself.permissions = result;
                        this._generateMenus();
                        resolve(this.myself)
                    } else {
                        return Promise.reject();
                    }
                }).catch(() => {
                    this.log.error("User Without Any Permissions " + this.myself.toString())
                    reject("User Without Any Permissions");
                })
            });
        } else {
            this.log.error("User not defined to load Permissions\n" + this.myself.toString())
            return Promise.reject("User not defined to load Permissions");
        }
    }

    /**
     * Return list of permissions enabled for user 
     */
    listPermissions() {
        return this.myself.permissions;
    }

}

module.exports = {
    Group,
    ClientMenus
};