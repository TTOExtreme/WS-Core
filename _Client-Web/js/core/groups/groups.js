class Tela_Grupos {

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
            title: "Codigo",
            field: "code",
            headerFilter: "input",
            resizable: true
        },
        {
            title: "Descrição",
            field: "descricao",
            headerFilter: "input",
            resizable: true,
            visible: false
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
        }
    ]


    constructor() {
        _events.on("Start.Tela.Grupos", (id_aba) => {
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
        this.Tela.innerHTML += "<div id='groups_table_" + this.id_tela + "'></div>";

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
                        this.TableHandler.config.footerElement = "<div id='groups_Tabulator_Footer_" + id_aba + "'>";

                        /**
                         * Configura as ações do botao direito em cada Linha
                         */
                        this.TableHandler.config.rowContextMenu = this.rowMenu;

                        /**
                         * Altera as configurações de Colunas e persistenceID
                         */
                        this.TableHandler.config.columns = this.columns;
                        this.TableHandler.config.persistenceID = "groups_Table";

                        this.TableHandler.Setup_tabulator('#groups_table_' + this.id_tela, (tabulator_instance) => {
                            this.tabulator = tabulator_instance;
                            setTimeout(() => {

                                let groups_footer = document.getElementById('groups_Tabulator_Footer_' + id_aba);
                                groups_footer.style.marginRight = '10px'
                                let Reload_Button = document.createElement('a');
                                Reload_Button.innerHTML = "<i class='material-symbols-outlined'>refresh</i>";
                                Reload_Button.setAttribute('class', 'tabulator-page')
                                Reload_Button.onclick = () => {
                                    this.reload_Group();
                                }
                                groups_footer.appendChild(Reload_Button);

                                let Add_Button = document.createElement('a');
                                Add_Button.innerHTML = "<i class='material-symbols-outlined'>group_add</i>";
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
                                                    input: "<input id='group.nome.add' placeholder='Nome'>",
                                                },

                                                {
                                                    active: true,
                                                    name: "Código",
                                                    input: "<input id='group.code.add' placeholder='0.0.0.0'>",
                                                },
                                                {
                                                    active: true,
                                                    name: "Descrição",
                                                    input: "<input id='group.descricao.add'>",
                                                },
                                                {
                                                    active: true,
                                                    name: "Ativo",
                                                    input: "<input type='checkbox' id='group.active.add'>",
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
                                                let unome = document.getElementById('group.nome.add').value;
                                                let ucode = document.getElementById('group.code.add').value;
                                                let udescr = document.getElementById('group.descricao.add').value;
                                                let uativo = document.getElementById('group.active.add').checked;
                                                if (unome == "" || ucode == "" || udescr == "") {
                                                    _events.emit("Info.Info", { text: "Favor preencher todos os campos." });
                                                    return;
                                                }
                                                this.add_group({
                                                    nome: unome,
                                                    code: ucode,
                                                    descricao: udescr,
                                                    ativo: (uativo ? 1 : 0)
                                                })
                                                    .then((groupdata) => {
                                                        _events.emit("Info.Ok", { text: "Grupo Criado.", payload: groupdata });
                                                        _events.emit("ContextCreator.Close", id);
                                                        this.reload_Group();
                                                    })
                                                    .catch((err) => {
                                                        _events.emit("Info.Erro", { text: "Erro ao criar Gruopo.", payload: err });
                                                        this.reload_Group();
                                                    })
                                            }
                                        });
                                }
                                groups_footer.appendChild(Add_Button);

                                this.reload_Group();
                            }, 300);
                        });
                    }, document.head)
                }, document.head)
            }, document.head)
        }, document.head)
    }

    //#region Chamadas Servidor
    /**
     * Sobe a lista de Grupos na tabela
     * @param {JSON} ListUsers 
     */
    load_groups(tabulator, err, ListUsers) {
        if (err) { console.error('Erro ao carregar lista de Grupos', err); return; }
        if (tabulator == undefined) { console.error('Erro Tabulator is Null', tabulator); return; }
        tabulator.setData(ListUsers);
    }

    /**
     * Realiza um recarregamento da lista de Grupos
     */
    reload_Group() {
        SocketEmit("Groups.List", (...args) => { this.load_groups(this.tabulator, ...args); })
    }

    /**
     * Subida de novos dados do usuário (completo)
     * @param {JSON} userdata 
     */
    edit_group(userdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Groups.Edit", userdata, (err, userupdated) => {
                if (err) { console.error("Erro no retorno do Usuário", err) }
                resolv(userupdated)
            })
        })
    }

    /**
     * Exclusão do usuário
     * @param {JSON} userdata 
     */
    delete_group(userdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Groups.Delete", userdata, (err, userupdated) => {
                if (err) { console.error("Erro no retorno do Usuário", err) }
                resolv(userupdated)
            })
        })
    }
    /**
     * Exclusão do usuário
     * @param {JSON} userdata 
     */
    active_group(userdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Groups.Active", userdata, (err, userupdated) => {
                if (err) { console.error("Erro no retorno do Usuário", err) }
                resolv(userupdated)
            })
        })
    }
    /**
     * Subida de novos dados do usuário (completo)
     * @param {JSON} userdata 
     */
    add_group(userdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Groups.Add", userdata, (err, userupdated) => {
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
            label: "<i class='material-symbols-outlined'>settings_account_box</i><span>Editar</span>",
            action: (e, row) => {

                let id_group_edit = BCypher.generateString();
                let bot_addUser = document.createElement('button');
                bot_addUser.setAttribute('class', 'contextMenu_submit')
                bot_addUser.innerText = "Editar";

                _events.emit('ContextCreator.Create',
                    {
                        items: [
                            {
                                active: true,
                                name: "ID",
                                input: "<input disabled id='group.id.edit_" + id_group_edit + "' value='" + row._row.data.id + "'>",
                            },
                            {
                                active: true,
                                name: "Nome",
                                input: "<input id='group.nome.edit_" + id_group_edit + "' value='" + row._row.data.nome + "'>",
                            },
                            {
                                active: true,
                                name: "Código",
                                input: "<input id='group.code.edit_" + id_group_edit + "' value='" + row._row.data.code + "'>",
                            },
                            {
                                active: true,
                                name: "Descrição",
                                input: "<input id='group.descricao.edit_" + id_group_edit + "' value='" + row._row.data.descricao + "'>",
                            },
                            {
                                active: true,
                                name: "Ativo",
                                input: "<input type='checkbox' id='group.active.edit_" + id_group_edit + "' " + (row._row.data.ativo == 1 ? 'checked' : '') + ">",
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
                            let uid = document.getElementById('group.id.edit_' + id_group_edit).value;
                            let unome = document.getElementById('group.nome.edit_' + id_group_edit).value;
                            let ucode = document.getElementById('group.code.edit_' + id_group_edit).value;
                            let udescr = document.getElementById('group.descricao.edit_' + id_group_edit).value;
                            let uativo = document.getElementById('group.active.edit_' + id_group_edit).checked;
                            if (unome == "" || ucode == "" || udescr == "") {
                                _events.emit("Info.Info", { text: "Favor preencher todos os campos." });
                                return;
                            }
                            this.edit_group({
                                id: uid,
                                nome: unome,
                                code: ucode,
                                descricao: udescr,
                                ativo: (uativo ? 1 : 0)
                            })
                                .then((groupdata) => {
                                    _events.emit("Info.Ok", { text: "Grupo Editado.", payload: groupdata });
                                    _events.emit("ContextCreator.Close", id);
                                    this.reload_Group();
                                })
                                .catch((err) => {
                                    _events.emit("Info.Erro", { text: "Erro ao editar Grupo.", payload: err });
                                    this.reload_Group();
                                })
                        }
                    });
            }
        }, {
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
                            input: "Grupo: " + nuserdata.nome,
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
                        _events.emit("Load.Permissoes.List", 'tabscreen_permission_' + id_subscreen, nuserdata.id, false);
                    }, document.head)
                });
            }
        },
        {
            label: "<i class='material-symbols-outlined'>delete</i><span>Excluir</span>",
            action: (e, row) => {
                let ncode = prompt("Confirme o Código para excluir <" + row._row.data.code + ">:");
                if (ncode == row._row.data.code) {
                    let nuserdata = row._row.data;
                    nuserdata.excluido = (nuserdata.excluido == 0 ? 1 : 0);
                    this.delete_group(nuserdata).then(() => {
                        this.reload_Group();
                    }).catch(() => {
                        events.emit("Info.Erro", { texto: "Falha ao realizar operação", payload: err });
                    })
                }
            }
        },
        {
            label: "<i class='material-symbols-outlined'>group_off</i><span>Inativar/Ativar</span>",
            action: (e, row) => {
                let ncode = prompt("Confirme o código para Inativar/Ativar <" + row._row.data.code + ">:");
                if (ncode == row._row.data.code) {
                    let nuserdata = row._row.data;
                    nuserdata.ativo = (nuserdata.ativo == 0 ? 1 : 0);
                    this.active_group(nuserdata).then(() => {
                        this.reload_Group();
                    }).catch(() => {
                        events.emit("Info.Erro", { texto: "Falha ao realizar operação", payload: err });
                    })
                }
            }
        },
    ]

}

new Tela_Grupos();