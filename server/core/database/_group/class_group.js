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
                    return this._loadPermissions().then(() => {
                        return Promise.resolve(this.myself);
                    })
                } else {
                    return Promise.reject();
                }
            }).catch((err) => {
                if (!err) this.log.info("Not Found group: <" + groupID + "> in database.");
                if (err) this.log.error(err);
                return Promise.reject("ID do Grupo Incorreto");
            }).then((result) => {
                //this.log.info("Found group: <" + groupID + "> in database.");
                return Promise.resolve(result)
            })

    }
    /**
     * Carrega as premissoes para o usuario
     * @param {id} groupID 
     */
    findmeidFromUser(UserId) {
        if (!UserId) {
            this.log.warning("UserID is Null, on researching group permissions");
            return Promise.reject("ID do Usuário é nulo")
        }
        return this.db.query("SELECT G.* FROM " + this.db.DatabaseName + "._User AS U " +
            " LEFT JOIN " + this.db.DatabaseName + ".rlt_User_Group AS UG ON UG.id_User = U.id" +
            " LEFT JOIN " + this.db.DatabaseName + "._Group AS G ON G.id = UG.id_Group" +
            " WHERE U.id=" + UserId + " and UG.active=1;")
            .catch((err) => {
                return Promise.reject("Wrong UserId: <" + UserId + ">.");
            }).then((result) => {
                return this.getGroupsFromUser(result);
            }).catch((err) => {
                if (!err) this.log.info("Not Found groups for User: <" + UserId + "> in database. When searching users Group");
                if (err) this.log.error(err);
                return Promise.reject("ID do Grupo Incorreto");
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
     * Carrega as permissoes de maneira recursiva para um grupo especifico
     * @param {Int} ChildID 
     */
    recLFLimit = 100;
    recLFCount = 0;
    _recLoadFatherPermissions(ChildID) {
        this.recLFCount++;
        if (this.recLFLimit > this.recLFCount) {
            return new Promise((resolve, reject) => {
                let perm = []
                this.getPermissionsOfGroup(ChildID).then(result => {
                    perm = perm.concat(result);
                    this.getGroupFathers(ChildID).then(fathers => {
                        if (fathers[0]) {
                            let allprom = []
                            fathers.forEach(group => {
                                this._recLoadFatherPermissions(group.id).then(FFPerm => {
                                    perm = perm.concat(FFPerm)
                                })
                            })

                            return Promise.all(allprom).finally(() => {
                                this.recLFCount = 0;
                                resolve(perm);
                            })
                        }
                    });

                });
            });
        } else {
            this.recLFCount = 0;
            return Promise.resolve([]);
        }
    }

    /**
     * Carrega os grupos pais e os coloca em estrutura hierarquica
     * @param {Int} ChildID 
     */
    _recLoadFatherGroups(ChildID) {
        //this.recLFCount++;
        if (this.recLFLimit > this.recLFCount) {
            return new Promise((resolve, reject) => {
                let groups = []
                this.getGroupFathers(ChildID).then(fathers => {
                    if (fathers[0]) {
                        let allprom = []
                        fathers.forEach(group => {
                            //retira o grupo pai da lista global de grupos (usado na listagem de grupos associados)
                            this.myself.allgroups = this.myself.allgroups.filter((grp) => { return grp.id != group.id });
                            allprom.push(
                                new Promise((res, rej) => {
                                    let g = group;
                                    return this._recLoadFatherGroups(group.id).then(FFGroup => {
                                        g["_children"] = FFGroup;
                                        //
                                        res(g);
                                    })
                                })
                            );
                        })

                        return Promise.all(allprom).then((group) => {
                            this.recLFCount = 0;
                            groups = groups.concat(group);
                        }).finally(() => {
                            groups = groups.filter((grp) => { return grp != undefined });
                            resolve(groups);
                        })
                    } else {
                        resolve([]);
                    }
                });
            });
        } else {
            this.log.warning("Estouro de processamento de grupos")
            this.recLFCount = 0;
            return Promise.resolve([]);
        }
    }

    /**
     * Carrega todas as permissoes para o usuario em questão
     * @param {JSON} preferences 
     */
    _loadPermissionsForUser(ListGroups) {
        //carrega cada hierarquia de grupo
        if (ListGroups[0]) {
            this.myself.groups = [];
            this.myself.permissions = [];
            let listProm = [];
            ListGroups.forEach(groupItem => {
                console.log("processando grupo: " + groupItem.id)
                listProm.push(new Promise((resolve, reject) => {
                    this.getPermissionsOfGroup(groupItem.id).then((result) => {
                        if (result[0]) {
                            //carrega todas as permissoes dos pais acima
                            return this._recLoadFatherPermissions(groupItem.id).then(perm => {
                                this.myself.permissions = this.myself.permissions.concat(perm);
                                resolve();
                            })
                        } else {
                            return Promise.reject();
                        }
                    }).catch((err) => {
                        this.log.error("Group Without Any Permissions " + this.myself.toString())
                        this.log.error(err)
                        reject("Group Without Any Permissions");
                    })
                }));
            })
            return Promise.all(listProm).finally(() => {
                return Promise.resolve(this.myself);
            });
        } else {
            this.log.error("Group not defined to load Permissions\n" + this.myself.toString())
            return Promise.reject("Group not defined to load Permissions");
        }
        //*/
    }


    getAllGroups() {
        return this.db.query("SELECT" +
            " RGG.id," +
            " 0 as active," +
            " RGG.name," +
            " ut1.username as createdBy," +
            " ut2.username as deactivatedBy," +
            " ut3.username as modifiedBy," +
            " RGG.createdIn," +
            " RGG.modifiedIn," +
            " RGG.deactivatedIn" +
            " FROM " + this.db.DatabaseName + "._Group AS RGG " +
            " LEFT JOIN WS_CORE_1_3_1._User as ut1 ON RGG.createdBy=ut1.id" +
            " LEFT JOIN WS_CORE_1_3_1._User as ut2 ON RGG.deactivatedBy=ut2.id" +
            " LEFT JOIN WS_CORE_1_3_1._User as ut3 ON RGG.modifiedBy=ut3.id;"
        );
    }

    getPermissionsOfGroup(id) {
        return this.db.query("SELECT *  FROM " + this.db.DatabaseName + "._Permissions AS P" +
            " LEFT JOIN " +
            " (SELECT " +
            " " + id + " as id_origin," +
            " g1.name as group_Name," +
            " g1.id as id," +
            " ut1.username as createdBy," +
            " ut2.username as deactivatedBy," +
            " ut3.username as modifiedBy," +
            " up1.active," +
            " up1.code_Permission," +
            " up1.createdIn," +
            " up1.deactivatedIn," +
            " up1.modifiedIn," +
            " up1.id_group" +
            " FROM " + this.db.DatabaseName + ".rlt_Group_Permissions as up1" +
            " LEFT JOIN WS_CORE_1_3_1._User as ut1 on up1.createdBy=ut1.id" +
            " LEFT JOIN WS_CORE_1_3_1._User as ut2 on up1.deactivatedBy=ut2.id" +
            " LEFT JOIN WS_CORE_1_3_1._User as ut3 on up1.modifiedBy=ut3.id" +
            " LEFT JOIN WS_CORE_1_3_1._Group as g1 on up1.id_Group=g1.id" +
            " WHERE up1.id_Group=" + id + " and g1.active=1) AS UP" +
            " ON P.code = UP.code_Permission;"
        );
    }

    getGroupFathers(id) {
        return this.db.query("SELECT" +
            " RGG.id_Group_Father," +
            " RGG.id_Group_Child," +
            " RGG.active," +
            " G.name," +
            " G.id," +
            " " + id + " as id_origin," +
            " ut1.username as createdBy," +
            " ut2.username as deactivatedBy," +
            " ut3.username as modifiedBy," +
            " RGG.createdIn," +
            " RGG.modifiedIn," +
            " RGG.deactivatedIn" +
            " FROM " + this.db.DatabaseName + ".rlt_Group_Group AS RGG " +
            " LEFT JOIN " + this.db.DatabaseName + "._Group AS G ON RGG.id_Group_Father=G.id" +
            " LEFT JOIN WS_CORE_1_3_1._User as ut1 ON RGG.createdBy=ut1.id" +
            " LEFT JOIN WS_CORE_1_3_1._User as ut2 ON RGG.deactivatedBy=ut2.id" +
            " LEFT JOIN WS_CORE_1_3_1._User as ut3 ON RGG.modifiedBy=ut3.id" +
            " WHERE RGG.id_Group_Child = " + id + " and RGG.active = 1;"
        );
    }

    /**
     * Coleta todos os grupos pais associados junto com os não associados
     * @param {int} groupID 
     */
    getGroups(groupID) {
        return new Promise((resolve, reject) => {
            if (groupID) {
                return this.getAllGroups().then(allgroups => {
                    this.myself.allgroups = allgroups;
                    return this._recLoadFatherGroups(groupID).then(groups => {
                        //
                        this.myself.allgroups = this.myself.allgroups.filter((grp) => { return grp.id != groupID });
                        resolve(groups.concat(this.myself.allgroups));
                    })
                })
            } else {
                reject("GroupID nulo na pesquisa de grupos associados")
            }
        })
    }


    /**
     * Coleta todos os grupos pais associados ao usuario junto com os não associados
     * @param {int} groupID 
     */
    getGroupsFromUser(ListGroups) {
        return new Promise((resolve, reject) => {
            return this.getAllGroups().then(allgroups => {
                let grps = [];
                this.myself.allgroups = allgroups;

                if (ListGroups[0]) {
                    let allProm = [];
                    ListGroups.forEach(groupItem => {
                        allProm.push(
                            this._recLoadFatherGroups(groupItem.id).then(groups => {
                                //
                                this.myself.allgroups = this.myself.allgroups.filter((grp) => { return grp.id != groupItem.id });
                                return Promise.resolve(groups);
                            })
                        )
                    })
                    return Promise.all(allProm)
                        .then((data) => {
                            console.log(data);
                            data.forEach(d => {
                                grps = d.concat(grps);
                            })
                        })
                        .finally((data) => {
                            console.log("final");
                            console.log(grps);
                            resolve(grps.concat(this.myself.allgroups));
                        })
                } else {
                    resolve(grps.concat(this.myself.allgroups));
                }
            })
        })
    }



    /**
     * Checa a recursividade para ver se ultrapassa o limite
     * @param {*} id 
     */
    recursiveLimit = 1000;
    recursiveCount = 0;
    checkRecursive(id) {
        if (id) {
            //this.myself.allgroups = this.myself.allgroups.filter(data => data.id != undefined)
            this.recursiveCount++;
            if (this.recursiveCount >= this.recursiveLimit) {
                this.recursiveCount = 0;
                this.log.warning("Check Maximum recursive research on Check of group hierarchy reached");
                return Promise.reject("Check Maximum recursive research on Check of group hierarchy reached");
            }
            let GroupHierarchy = [];
            return new Promise((resolve, reject) => {
                this.getGroupFathers(id).then((result) => {
                    if (result[0]) {
                        let allprom = []
                        result.forEach(group => {
                            allprom.push(
                                this.checkRecursive(group.id_Group_Father).then(GroupHierarchyRet => {
                                    group["_children"] = GroupHierarchyRet;
                                    return Promise.resolve(group);
                                })
                            );
                        });

                        Promise.all(allprom).then((values) => {
                            resolve(values);
                        })
                    } else {
                        resolve(GroupHierarchy);
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
     * Return list of permissions
     */
    listPermissions() {
        return this.myself.permissions;
    }

    /**
     * Return list of groups Associated and not 
     */
    listGroups() {
        return this.myself.groups;
    }

}

module.exports = {
    Group
};