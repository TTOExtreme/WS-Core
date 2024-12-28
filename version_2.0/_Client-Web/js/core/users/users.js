class Tela_Users {

    // Id da tela
    id_tela = null;
    // Elemento da tela
    Tela = null;
    //instancia do Tabulator na tela
    tabulator = null;

    //estrutura da tabela
    columns = [
        {
            title: "ID",
            field: "id",
            headerFilter: "input",
            sorter: "number",
            resizable: true
        },
        {
            title: "Nome",
            field: "nome",
            headerFilter: "input",
            resizable: true
        },
        {
            title: "Usuário",
            field: "username",
            headerFilter: "input",
            resizable: true
        },
        {
            title: "E-Mail",
            field: "email",
            headerFilter: "input",
            resizable: true
        },
        {
            title: "Criado Em",
            field: "criado_em",
            headerFilter: "input",
            resizable: true,
            visible: false
        },
        {
            title: "Criado por",
            field: "criado_por",
            headerFilter: "input",
            resizable: true,
            visible: false
        },
        {
            title: "Excluido",
            field: "excluido",
            headerFilter: "list",
            headerFilterParams: { values: { 1: "Sim", 0: "Não", "": "-" }, clearable: true },
            headerFilterPlaceholder: "Não",
            formatter: "tickCross",
            resizable: true,
            visible: false
        },
        {
            title: "Excluido Em",
            field: "excluido_em",
            headerFilter: "input",
            resizable: true,
            visible: false
        },
        {
            title: "Alterado Por",
            field: "alterado_por",
            headerFilter: "input",
            resizable: true,
            visible: false
        },
        {
            title: "Alterado Em",
            field: "alterado_em",
            headerFilter: "input",
            resizable: true,
            visible: false
        },
        {
            title: "Ativo",
            field: "ativo",
            headerFilter: "list",
            headerFilterParams: { values: { 1: "Ativo", 0: "Inativo", "": "-" }, clearable: true },
            formatter: 'tickCross',
            resizable: true
        },
        {
            title: "Online",
            field: "online",
            headerFilter: "list",
            headerFilterParams: { values: { 1: "Online", 0: "Offline", "": "-" }, clearable: true },
            formatter: 'tickCross',
            resizable: true
        }
    ]


    constructor() {
        _events.on("Start.Tela.Usuários", (id_aba) => {
            this.Start(id_aba);

        })
    }

    /**
     * Inicia a Tela passando o ID da Aba a ser vinculada
     * @param {String} id_aba 
     */
    Start(id_aba = null) {
        if (id_aba == null) {
            console.error("Id da Aba esta nulo");
            return;
        }
        this.id_tela = id_aba;
        this.Tela = TelaPrincipal.CreateScreen(id_aba);


        this.Tela.innerHTML = "<p class='tela_id'>ID Tela: " + this.id_tela + "</p>";
        this.Tela.innerHTML += "<div id='users_table_" + this.id_tela + "'></div>";

        loadJS('/js/libs/tabulator.min.js', () => {
            loadJS('/js/core/TableHandler.js', () => {
                loadCSS('/css/libs/tabulator.min.css', () => {
                    loadCSS('/css/libs/tabulatorcolor.css', () => {
                        /**
                         * Inicializa tabela Setup Generico
                         */
                        this.TableHandler = new TableHandler();

                        /**
                         * Adiciona o Header menu para poder selecionar quais colunas estarão visiveis
                         */
                        this.columns.forEach(e => {
                            e.headerMenu = this.TableHandler.headerMenu;
                        })

                        /**
                         * Adiciona o menu de botoes ao final da tabela
                         */
                        this.TableHandler.config.footerElement = "<div id='Users_Tabulator_Footer" + id_aba + "'>";

                        /**
                         * Configura as ações do botao direito em cada Linha
                         */
                        this.TableHandler.config.rowContextMenu = this.rowMenu;

                        /**
                         * Altera as configurações de Colunas e persistenceID
                         */
                        this.TableHandler.config.columns = this.columns;
                        this.TableHandler.config.persistenceID = "Users_Table";

                        this.TableHandler.Setup_tabulator('#users_table_' + this.id_tela, (tabulator_instance) => {
                            this.tabulator = tabulator_instance;
                            setTimeout(() => {

                                let users_footer = document.getElementById('Users_Tabulator_Footer' + id_aba);
                                users_footer.style.marginRight = '10px'
                                let Reload_Button = document.createElement('a');
                                Reload_Button.innerHTML = "<i class='material-symbols-outlined'>refresh</i>";
                                Reload_Button.setAttribute('class', 'tabulator-page')
                                Reload_Button.onclick = () => {
                                    this.reload_Users();
                                }
                                users_footer.appendChild(Reload_Button);

                                let Add_Button = document.createElement('a');
                                Add_Button.innerHTML = "<i class='material-symbols-outlined'>person_add</i>";
                                Add_Button.setAttribute('class', 'tabulator-page')
                                Add_Button.onclick = () => {
                                    let bot_addUser = document.createElement('button');
                                    bot_addUser.setAttribute('class', 'contextMenu_submit')
                                    bot_addUser.innerText = "Adicionar";

                                    _events.emit('ContextCreator.Create',
                                        {
                                            items: [
                                                {
                                                    active: true,
                                                    name: "Nome",
                                                    input: "<input id='users.nome.add' placeholder='Nome'>",
                                                },
                                                {
                                                    active: true,
                                                    name: "Usuário",
                                                    input: "<input id='users.username.add' placeholder='Username'>",
                                                },
                                                {
                                                    active: true,
                                                    name: "Email",
                                                    input: "<input id='users.email.add' placeholder='E-Mail'>",
                                                },
                                                {
                                                    active: true,
                                                    name: "Senha",
                                                    input: "<input type='password' id='users.pass1.add'>",
                                                },
                                                {
                                                    active: true,
                                                    name: "Confirmação Senha",
                                                    input: "<input type='password' id='users.pass2.add'>",
                                                },
                                                {
                                                    active: true,
                                                    name: "Ativo",
                                                    input: "<input type='checkbox' id='users.active.add'>",
                                                },
                                                {
                                                    active: true,
                                                    name: "",
                                                    input: bot_addUser,
                                                    inputType: 'element',
                                                },
                                            ]
                                        }
                                        , (id) => {
                                            console.log("ID Contexto", id);
                                            bot_addUser.onclick = (ev) => {
                                                let unome = document.getElementById('users.nome.add').value;
                                                let uusername = document.getElementById('users.username.add').value;
                                                let uemail = document.getElementById('users.email.add').value;
                                                let upass1 = document.getElementById('users.pass1.add').value;
                                                let upass2 = document.getElementById('users.pass2.add').value;
                                                let uativo = document.getElementById('users.active.add').checked;
                                                if (unome == "" || uusername == "" || uemail == "" || upass1 == "" || upass2 == "") {
                                                    _events.emit("Info.Info", { text: "Favor preencher todos os campos." });
                                                    return;
                                                }
                                                if (upass1 != upass2) {
                                                    _events.emit("Info.Info", { text: "Senhas diferentes." });
                                                    return;
                                                }
                                                this.add_user({
                                                    nome: unome,
                                                    username: uusername,
                                                    email: uemail,
                                                    password: BCypher.SHA2(upass1),
                                                    ativo: (uativo ? 1 : 0)
                                                })
                                                    .then((userdata) => {
                                                        _events.emit("Info.Ok", { text: "Usuário Criado.", payload: userdata });
                                                        _events.emit("ContextCreator.Close", id);
                                                        this.reload_Users();
                                                    })
                                                    .catch((err) => {
                                                        _events.emit("Info.Erro", { text: "Erro ao criar Usuário.", payload: err });
                                                        this.reload_Users();
                                                    })
                                            }
                                        });
                                }
                                users_footer.appendChild(Add_Button);

                                this.reload_Users();
                            }, 300);
                        });
                    }, document.head)
                }, document.head)
            }, document.head)
        }, document.head)
    }

    //#region Chamadas Servidor
    /**
     * Sobe a lista de usuários na tabela
     * @param {JSON} ListUsers 
     */
    load_users(tabulator, err, ListUsers) {
        if (err) { console.error('Erro ao carregar lista de usuários', err); return; }
        if (tabulator == undefined) { console.error('Erro Tabulator is Null', tabulator); return; }
        tabulator.setData(ListUsers);
    }

    /**
     * Realiza um recarregamento da lista de usuários
     */
    reload_Users() {
        SocketEmit("Users.List", (...args) => { this.load_users(this.tabulator, ...args); })
    }

    /**
     * Subida de novos dados do usuário (completo)
     * @param {JSON} userdata 
     */
    edit_user(userdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Users.Edit", userdata, (err, userupdated) => {
                if (err) { console.error("Erro no retorno do Usuário", err) }
                resolv(userupdated)
            })
        })
    }
    /**
     * Subida de novos dados do usuário (Senha)
     * @param {JSON} userdata 
     */
    edit_user_pass(userdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Users.Edit.Pass", userdata, (err, userupdated) => {
                if (err) { console.error("Erro no retorno do Usuário", err) }
                resolv(userupdated)
            })
        })
    }
    /**
     * Exclusão do usuário
     * @param {JSON} userdata 
     */
    delete_user(userdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Users.Delete", userdata, (err, userupdated) => {
                if (err) { console.error("Erro no retorno do Usuário", err) }
                resolv(userupdated)
            })
        })
    }
    /**
     * Exclusão do usuário
     * @param {JSON} userdata 
     */
    active_user(userdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Users.Active", userdata, (err, userupdated) => {
                if (err) { console.error("Erro no retorno do Usuário", err) }
                resolv(userupdated)
            })
        })
    }
    /**
     * Subida de novos dados do usuário (completo)
     * @param {JSON} userdata 
     */
    add_user(userdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Users.Add", userdata, (err, userupdated) => {
                if (err) {
                    console.error("Erro no retorno do Usuário", err);
                    reject(err);
                    return;
                }
                resolv(userupdated)
            })
        })
    }
    //#endregion


    /**
     * Configura as ações do botao direito em cada Linha
     */
    rowMenu = [
        {
            label: "<i class='material-symbols-outlined'>mail</i><span>Alterar Email</span>",
            action: (e, row) => {
                let nEmail = prompt("Digite o novo Email:", row._row.data.email);
                if (nEmail != null && nEmail != "") {
                    let nuserdata = row._row.data;
                    nuserdata.email = nEmail;
                    this.edit_user(nuserdata).then((retuser) => {
                        row.update(retuser);
                    }).catch(() => {
                        events.emit("Info.Erro", { texto: "Falha ao realizar operação", payload: err });
                    })
                }
            }
        },
        {
            label: "<i class='material-symbols-outlined'>key</i><span>Resetar Senha</span>",
            action: (e, row) => {
                let nPass = prompt("Digite a nova Senha:");
                if (nPass != null && nPass != "") {
                    let nuserdata = row._row.data;
                    nuserdata.password = BCypher.SHA2(nPass);
                    this.edit_user_pass(nuserdata).then((retuser) => {
                        row.update(retuser);
                    }).catch(() => {
                        events.emit("Info.Erro", { texto: "Falha ao realizar operação", payload: err });
                    })
                }
            }
        },
        /*
        {
            label: "Selecionar Usuário",
            action: function (e, row) {
                row.select();
            }
        },//*/
        {
            separator: true,
        },
        {
            label: "Funçoes Administrativas",
            menu: [
                {
                    label: "<i class='material-symbols-outlined'>settings_account_box</i><span>Permissões</span>",
                    action: (e, row) => {
                        let nuserdata = row._row.data;

                        let tab_screen = document.createElement('div');
                        tab_screen.setAttribute('class', 'tab_Screen')
                        let id_subscreen = BCypher.generateString();
                        tab_screen.setAttribute('id', 'tabscreen_permission_' + id_subscreen)

                        _events.emit('ContextCreator.Create', {
                            items: [
                                {
                                    active: true,
                                    name: "",
                                    input: "Usuário: " + nuserdata.username,
                                },
                                {
                                    active: true,
                                    name: "",
                                    input: tab_screen,
                                    inputType: 'element',
                                }
                            ]
                        }, (id_aba) => {
                            loadJS('/js/core/permissao/permissao.js', () => {
                                _events.emit("Load.Permissoes.List", 'tabscreen_permission_' + id_subscreen, nuserdata.id, true);
                            }, document.head)
                        });
                    }
                },
                {
                    label: "<i class='material-symbols-outlined'>delete</i><span>Excluir</span>",
                    action: (e, row) => {
                        let nUsername = prompt("Confirme o nome do Usuário para excluir <" + row._row.data.username + ">:");
                        if (nUsername == row._row.data.username) {
                            let nuserdata = row._row.data;
                            nuserdata.excluido = (nuserdata.excluido == 0 ? 1 : 0);
                            this.delete_user(nuserdata).then(() => {
                                row.delete();
                            }).catch(() => {
                                events.emit("Info.Erro", { texto: "Falha ao realizar operação", payload: err });
                            })
                        }
                    }
                },/*
                {
                    label: "<span class='material-symbols-outlined'>delete</span> Excluir",
                    disabled: true,
                },//*/
                {
                    label: "<i class='material-symbols-outlined'>person_off</i><span>Inativar/Ativar</span>",
                    action: (e, row) => {
                        let nUsername = prompt("Confirme o nome do Usuário para Inativar/Ativar <" + row._row.data.username + ">:");
                        if (nUsername == row._row.data.username) {
                            let nuserdata = row._row.data;
                            nuserdata.ativo = (nuserdata.ativo == 0 ? 1 : 0);
                            this.active_user(nuserdata).then(() => {
                                this.reload_Users();
                            }).catch(() => {
                                events.emit("Info.Erro", { texto: "Falha ao realizar operação", payload: err });
                            })
                        }
                    }
                },
                /*
                {
                    label: "<span class='material-symbols-outlined'>delete</span> Excluir",
                    disabled: true,
                },//*/
            ]
        }
    ]

}

new Tela_Users();