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
                    return this._loadHierarchyPermissions();
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
                this.getPermissionsOfGroup(this.myself.id).then((result) => {
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
    _loadHierarchyPermissions() {
        if (this.myself.id) {
            return new Promise((resolve, reject) => {
                this.getPermissionsOfGroup(this.myself.id).then((result) => {
                    if (result[0]) {
                        this.myself.permissions = result;
                        console.log(this.myself.permissions)
                        console.log("Get pure")
                        this._loadGroupTree(this.myself.id).then(() => {
                            this.myself.permissions.map((data) => { data["id_origin"] = this.myself.id; return data; })
                            console.log(this.myself.permissions)
                            resolve(this.myself)
                        }).catch(err => {
                            this.log.error("Error Loading Group Hierarchy from Group ID: " + this.myself.id);
                            this.log.error(err);
                            reject("Group hierarchy Error");
                        })
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

    getPermissionsOfGroup(id) {
        return this.db.query("SELECT *  FROM " + this.db.DatabaseName + "._Permissions AS P" +
            " LEFT JOIN " +
            " (SELECT " +
            " g1.name as group_Name," +
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
            " LEFT JOIN WS_CORE_1_3_1._Group as g1 on up1.id_Group=g1.id" +
            " WHERE up1.id_Group=" + id + " ) AS UP" +
            " ON P.code = UP.code_Permission;"
        );
    }

    getGroupFathers(id) {
        return this.db.query("SELECT" +
            " id_Group_Father," +
            " id_Group_Child," +
            " active" +
            " FROM " + this.db.DatabaseName + ".rlt_Group_Group " +
            " WHERE id_Group_Child = " + id + " and active = 1;"
        );
    }


    /**
     * Function to load permissions from database
     * @param {JSON} preferences 
     */
    _loadGroupTree(id) {
        if (id) {
            return new Promise((resolve, reject) => {
                this.getGroupFathers(id).then((result) => {
                    if (result[0]) {
                        result.forEach(group => {
                            if (!this.myself.groups["_" + group.id_Group_Father]) {
                                this.myself.groups["_" + group.id_Group_Father] = true;


                                this.getPermissionsOfGroup(group.id_Group_Child).then(resultPerms => {

                                    resultPerms.map((value) => {
                                        this.myself.permissions.map((value1, index1, array1) => {
                                            if (value.code == value1.code && value.id_group != null) {
                                                array1[index1] = value;
                                                console.log("Update: " + value.code + " From " + value.id_group)
                                                return value;
                                            }
                                            return value1;
                                        })
                                        return value
                                    })
                                    //this.myself.permissions.concat(resultPerms.filter((item) => this.myself.permissions.indexOf(item) < 0));
                                });

                                this._loadGroupTree(group.id_Group_Father).then(() => {
                                    resolve();
                                }).catch(err => {
                                    this.log.error("Loading hierarchy of " + group.id_Group_Father)
                                    this.log.error(err);
                                    reject("Group Without Any Permissions");
                                });
                            }
                        });
                    } else {
                        console.log("Fim da pesquisa de hierarquia");
                        //console.log(this.myself.permissions);
                        resolve(this.myself.permissions);
                    }
                }).catch((err) => {
                    this.log.error("Group Without Any Permissions " + this.myself.toString())
                    this.log.error(err);
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