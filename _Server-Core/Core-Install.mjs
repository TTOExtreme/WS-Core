import Group from "./database/Manipulators/Groups/Groups.mjs";
import User from "./database/Manipulators/Users/Users.mjs";
import BCypher from "./utils/BCypher_2.0.mjs";


/**
 * Modulo de instalação do sistema no banco de dados
 */
export default class Installer {

    // instancia do conector do banco de dados
    db = null;
    userInstance = null;
    log = null;

    /**
     * Inicializa o sistema de instalação
     * @param {Class} WSCore instancia do WSCore
     * @description Usado somente para a instancia principal do sistema, não deve ser reinstanciado por outras classes
     */
    constructor(WSCore) {
        if (WSCore._db == null) {
            console.error("Banco de dados não connectado ao WSCore Class\n err on constructor of class Installer")
            throw "Banco de dados não conectado";
        }
        this.db = WSCore._db;
        this.log = WSCore._log;
        this.userInstance = new User(WSCore);
        this.groupInstance = new Group(WSCore);
    }

    Install() {
        if (this.db == null) {
            console.error("Banco de dados não connectado ao WSCore Class\n err on install function of class Installer")
            throw "Banco de dados não conectado";
        }
        return new Promise((res, rej) => {
            this.userInstance.LogInSYSTEM().then(() => {
                /**
                 * Drop/remove conteudo da collection
                 */
                this.userInstance.users.drop();
                this.groupInstance.groups.drop();

                /**
                 * Cria usuario de acesso Web no banco
                 */
                this.log.system("Criando Usuário")
                this.CreateUser().then((usr) => {
                    this.log.system(" - Usuário admin adicionado")
                    this.log.system("Criando Grupo")
                    this.CreateGroup().then((grp) => {
                        this.log.system(" - Grupo Administradores adicionado")
                        this.log.system("Adicionando Grupo Administradores ao usuário")
                        this.userInstance.AddGroup(usr.UUID, grp.GUID).then(result => {
                            if (result.acknowledged) {
                                this.log.system(" - Grupo Adicionado ao Usuário admin")
                                res();
                            }
                        }).catch(err => {
                            this.log.error("Na adição do grupo ao usuario", err);
                            rej(err);
                        })
                    }).catch(err => {
                        this.log.error("Na criação do grupo", err);
                        rej(err);
                    })
                }).catch(err => {
                    this.log.error("Na criação de usuário", err);
                    rej(err);
                })
            }).catch(err => {
                this.log.error("Ao Logar como SYSTEM,\n essa call não deve ser executada", err);
                rej(err);
            });
        });
    }

    /**
     * Cria o usuario admin com a senha admin
     * @returns {Promisse} Dados do Usuario
     */
    CreateUser() {
        return new Promise((res, rej) => {
            this.userInstance.GetUserUUID("admin").then(usr => {
                if (usr != undefined) {
                    return this.userInstance.Disable(usr.UUID);
                } else {
                    return Promise.resolve();
                }
            }).catch(err => {
                res()
            })
        }).then(() => {
            return new Promise((res, rej) => {
                this.userInstance.AddUser("admin",
                        "Administrador",
                        new BCypher().SHA2("admin"),
                        new BCypher().generateString(), [], {},
                        new BCypher().generateString(), true)
                    .then(result => {
                        res(result)
                    })
                    .catch(err => {
                        rej(err)
                    })
            })
        })
    }

    CreateGroup() {
        return this.groupInstance.AddGroup("Administradores", ["adm/system"], {},
            new BCypher().generateString(), this.userInstance.GetUUID(), true);
    }
}