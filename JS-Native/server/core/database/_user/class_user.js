/**
 * User Data Instance
 */
const UserStruct = require('../structures/main/UserStruct').UserStruct;
const WSMainServer = require('../../../main');
const Bcypher = require("../../utils/bcypher").Bcypher;

/**
 * @typedef User
 */
class User {

    /**@const {WSLog} log */
    log;
    /**@const {WSCfg} cfg */
    cfg;
    /**@const {DBConnector} db */
    db;
    /**@param {ClientMenus} Menus */
    Menus;

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
    }

    myself = new UserStruct();

    /**
     * Function for finding user in database
     * @param {string} username 
     * @param {string} pass 
     * @returns {Promise}
     */
    findme(username, pass) {
        if (!username || !pass) {
            this.log.warning("User Or Password is Null");
            return Promise.reject("Usuário ou Senha esta em branco")
        }
        this.log.info("Searching user: <" + username + "> in database.");
        return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._User WHERE username='" + username + "';").then((result) => {
            const salt = result[0].salt;
            return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._User WHERE username='" + username + "' AND password='" + this.bcypher.sha512(salt + pass) + "';")
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
            return Promise.reject("Not Found user: <" + username + "> in database.");
        }).then((result) => {
            this.log.info("Found user: <" + username + "> in database.");
            return Promise.resolve(result)
        })
    }


    /**
     * Function for finding user in database from uuid
     * @param {string} uuid 
     * @returns {Promise}
     */
    findmeuuid(uuid) {
        if (!uuid) {
            this.log.warning("UUID is Null");
            return Promise.reject("UUID esta em branco")
        }
        this.log.info("Searching user UUID: <" + uuid + "> in database.");
        return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._User WHERE UUID='" + uuid + "';")
            .catch((err) => {
                if (!err) this.log.warning("Not Found user UUID: <" + uuid + "> in database.");
                if (err) this.log.error(err);
                return Promise.reject("Not Found user UUID: <" + uuid + "> in database.");
            }).then((result) => {
                if (result[0]) {
                    this.log.info("Login In: <" + uuid + ">.");
                    this.myself = new UserStruct(result[0]);
                    return this._loadPermissions();
                } else {
                    this.log.warning("Not Found user UUID: <" + uuid + "> in database.");
                    return Promise.reject("Not Found user UUID: <" + uuid + "> in database.");
                }
            })
    }

    /**
     * Function for finding user in database from ID
     * @param {string} id
     * @returns {Promise}
     */
    findmeid(id) {
        if (!id) {
            this.log.warning("ID is Null");
            return Promise.reject("ID esta em branco")
        }
        this.log.info("Searching user ID: <" + id + "> in database.");
        return this.db.query("SELECT * FROM " + this.db.DatabaseName + "._User WHERE id='" + id + "';")
            .catch((err) => {
                if (!err) this.log.warning("Not Found user ID: <" + id + "> in database.");
                if (err) this.log.error(err);
                return Promise.reject("Not Found user ID: <" + id + "> in database.");
            }).then((result) => {
                if (result[0]) {
                    this.log.info("Found User with ID: <" + id + "> in database.");
                    this.myself = new UserStruct(result[0]);
                    return this._loadPermissions();
                } else {
                    this.log.warning("Not Found user ID: <" + id + "> in database.");
                    return Promise.reject("Not Found user ID: <" + id + "> in database.");
                }
            })
    }

    /**
     * @returns {UserStruct} User data for Client
     */
    getUserClientData() {
        let ud = JSON.parse(this.myself.toString());
        delete ud.password;
        delete ud.salt;
        delete ud.createdBy;
        delete ud.deactivatedBy;
        delete ud.deactivatedIn;
        delete ud.active;
        delete ud.connected;
        delete ud.id;
        delete ud.permissions;
        return (ud);
    }

    /**
     * Function for changing the user pass
     * @param {string} oldPass 
     * @param {string} newPass 
     */
    changePass(oldPass, newPass) {
        // TODO

        this.log.info("User change Password User: <" + username + ">.");
    }

    /**
     * Function to save preferences on database
     * @param {JSON} preferences 
     */
    savePreferences(preferences) {
        //TODO
    }

    /**
     * Function to load preferences from database
     * @param {JSON} preferences 
     */
    loadPreferences() {
        //TODO
    }

    /**
     * Function to Reset UUID on database
     * @returns {Promise}
     */
    resetUUID() {
        if (this.myself.id) {
            const nUUID = this.bcypher.generate_crypt()
            return new Promise((resolve, reject) => {
                this.db.query("UPDATE " + this.db.DatabaseName + "._User" +
                    " SET UUID='" + nUUID + "'" +
                    " WHERE id=" + this.myself.id + ";").then(() => {
                    this.myself.uuid = nUUID;
                    resolve(nUUID);
                }).catch(err => {
                    this.log.error("Cannot Set UUID:\n" + (err).toString());
                })
            })
        } else {
            this.log.error("User not defined to Reset UUID\n" + this.myself.toString())
            return Promise.reject("User not defined to Reset UUID")
        }
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
     * Function to update database with user status
     */
    LogOut() {
        if (this.myself.id) {
            this.myself.connected = 0;
            this.db.query("UPDATE " + this.db.DatabaseName + "._User" +
                " SET connected = 0 " +
                "WHERE id=" + this.myself.id + " " +
                ";").then(() => {
                this.log.info("User <" + this.myself.username + "> Logged Out")
            }).catch((err) => {
                this.log.error("On LogOut Set Status");
                this.log.error(err);
            })
        }
    }

    /**
     * verify user status if is logged or not 
     */
    isLogged() {
        return (this.myself.connected == 1);
    }

    /**
     * Function to update database with user status
     */
    LogIn(data) {
        this.db.query("UPDATE " + this.db.DatabaseName + "._User" +
            " SET connected = 1 ," +
            " lastIp='" + data.ip + "' ," +
            " lastConnection='" + Date.now() + "' " +
            "WHERE id=" + this.myself.id + " " +
            ";").then(() => {
            this.log.info("User <" + this.myself.username + "> Logged In")
        }).catch((err) => {
            this.log.error("On Login Set Status");
            this.log.error(err);
        })
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

    /**
     * Function to append menus
     * @param {JSON} menus 
     */
    AppendMenus(menus) {
        this.Menus = this.Menus.concat(this.Menus, menus);
    }

    /**
     * Function to get list of menus
     * @param {JSON} menus 
     */
    GetMenus() {
        return this.Menus;
    }


    _generateMenus() {
        try {
            let _AdmMenus = AdmMenus;
            _AdmMenus.forEach((Menu, index, arr) => {
                if (this.checkPermissionSync(Menu.Id)) {
                    Menu.SubItems.forEach((SubMenu, Subindex, Subarr) => {
                        if (this.checkPermissionSync(SubMenu.Id)) {
                            SubMenu.TopItems.forEach((TopMenu, Topindex, Toparr) => {
                                if (this.checkPermissionSync(TopMenu.Id)) {} else {
                                    Toparr.splice(Topindex, 1);
                                }
                            });
                        } else {
                            Subarr.splice(Subindex, 1);
                        }
                    });
                    Menu.TopItems.forEach((TopMenu, Topindex, Toparr) => {
                        if (this.checkPermissionSync(TopMenu.Id)) {} else {
                            Toparr.splice(Topindex, 1);
                        }
                    });
                } else {
                    arr.splice(index, 1);
                }
            })
            this.Menus = _AdmMenus;
        } catch (err) {
            this.log.error(err)
        }
    }

}

class ClientMenus {
    /**@const {string} Name Name to show */
    Name;
    /**@const {string} Id  Id for the item */
    Id;
    /**@const {string} Icon  Path o icon */
    Icon;
    /**@const {Function} Event Event on Click */
    Event
    /**@const {ClientMenus} SubItems Child Items */
    SubItems;
    /**@const {ClientMenus} TopItems Items on top menu */
    TopItems;
}

let AdmMenus = [{
    Name: "Administração",
    Id: "menu/adm",
    Icon: "",
    Event: () => {},
    SubItems: [{
            Name: "Usuários",
            Id: "menu/adm/usr",
            Icon: "",
            EventCall: "Load",
            EventData: "./js/core/user/list.js",
            TopItems: [{
                Name: "Adicionar",
                Id: "menu/adm/usr/add",
                EventCall: "Load",
                EventData: "./js/core/user/add.js",
            }],
        },
        {
            Name: "Grupos",
            Id: "menu/adm/grp",
            Icon: "",
            EventCall: "Load",
            EventData: "./js/core/group/list.js",
            TopItems: [{
                Name: "Adicionar",
                Id: "menu/adm/grp/add",
                EventCall: "Load",
                EventData: "./js/core/group/add.js",
            }],
        }
    ],
    TopItems: [],
}]

module.exports = {
    User,
    ClientMenus
};