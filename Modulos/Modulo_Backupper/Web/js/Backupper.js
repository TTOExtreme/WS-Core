class Tela_Backupper {

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
            title: "Descrição",
            field: "descricao",
            headerFilter: "input",
            resizable: true,
            visible: false
        },
        {
            title: "Preferencias",
            field: "preferences",
            headerFilter: "input",
            resizable: true,
            visible: false
        },
        {
            title: "Salvar Log",
            field: "salvar_log",
            headerFilter: "list",
            headerFilterParams: { values: { 1: "Sim", 0: "Não", "": "-" }, clearable: true },
            headerFilterPlaceholder: "Não",
            formatter: "tickCross",
            resizable: true,
            visible: false
        },
        {
            title: "Ultima Execução",
            field: "ultima_execucao",
            headerFilter: "input",
            resizable: true,
            visible: false
        },
        {
            title: "Qnt Execuções",
            field: "qnt_execucoes",
            headerFilter: "input",
            resizable: true,
            visible: false
        },
        {
            title: "Tempo Restart",
            field: "tempo_restart",
            headerFilter: "input",
            resizable: true,
            visible: false
        },
        {
            title: "Proximo Restart",
            field: "proximo_restart",
            headerFilter: "input",
            resizable: true,
            visible: false
        },
        {
            title: "Cron",
            field: "crontab",
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
        _events.on("Start.Tela.Backupper", (id_aba) => {
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
        this.Tela.innerHTML += "<div id='backupper_table_" + this.id_tela + "'></div>";

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
                        this.TableHandler.config.footerElement = "<div id='backupper_Tabulator_Footer_" + id_aba + "'>";

                        /**
                         * Configura as ações do botao direito em cada Linha
                         */
                        this.TableHandler.config.rowContextMenu = this.rowMenu;

                        /**
                         * Altera as configurações de Colunas e persistenceID
                         */
                        this.TableHandler.config.columns = this.columns;
                        this.TableHandler.config.persistenceID = "backupper_Table";

                        this.TableHandler.Setup_tabulator('#backupper_table_' + this.id_tela, (tabulator_instance) => {
                            this.tabulator = tabulator_instance;
                            setTimeout(() => {

                                let backupper_footer = document.getElementById('backupper_Tabulator_Footer_' + id_aba);
                                backupper_footer.style.marginRight = '10px'
                                let Reload_Button = document.createElement('a');
                                Reload_Button.innerHTML = "<i class='material-symbols-outlined'>refresh</i>";
                                Reload_Button.setAttribute('class', 'tabulator-page')
                                Reload_Button.onclick = () => {
                                    this.reload_Backupper();
                                }
                                backupper_footer.appendChild(Reload_Button);

                                let Add_Button = document.createElement('a');
                                Add_Button.innerHTML = "<i class='material-symbols-outlined'>note_add</i>";
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
                                                    input: "<input id='backupper.nome.add' placeholder='Nome'>",
                                                },
                                                {
                                                    active: true,
                                                    name: "Descrição",
                                                    input: "<input id='backupper.descricao.add'>",
                                                },
                                                {
                                                    active: true,
                                                    name: "Preferencias",
                                                    input: "<textarea id='backupper.preferencias.add'></textarea>",
                                                },
                                                {
                                                    active: true,
                                                    name: "Tempo Restart",
                                                    input: "<input title='Tempo em Segundos para cada Restart' id='backupper.restart.add'>",
                                                },
                                                {
                                                    active: true,
                                                    name: "Cron",
                                                    input: "<input title='Configuração de Execução Cron' id='backupper.cron.add'>",
                                                },
                                                {
                                                    active: true,
                                                    name: "Ativo",
                                                    input: "<input type='checkbox' id='backupper.active.add'>",
                                                },
                                                {
                                                    active: true,
                                                    name: "Salvar Log",
                                                    input: "<input type='checkbox' id='backupper.log.add'>",
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
                                                let unome = document.getElementById('backupper.nome.add').value;
                                                let udescr = document.getElementById('backupper.descricao.add').value;
                                                let upref = document.getElementById('backupper.preferencias.add').value;
                                                let urestart = document.getElementById('backupper.restart.add').value;
                                                let ucron = document.getElementById('backupper.cron.add').value;
                                                let uativo = document.getElementById('backupper.active.add').checked;
                                                let ulog = document.getElementById('backupper.log.add').checked;
                                                if (unome == "" || udescr == "") {
                                                    _events.emit("Info.Info", { text: "Favor preencher todos os campos." });
                                                    return;
                                                }
                                                this.add_Backup({
                                                    nome: unome,
                                                    descricao: udescr,
                                                    preferences: upref,
                                                    tempo_restart: urestart,
                                                    crontab: ucron,
                                                    ativo: (uativo ? 1 : 0),
                                                    salvar_log: (ulog ? 1 : 0)
                                                })
                                                    .then((groupdata) => {
                                                        _events.emit("Info.Ok", { text: "Configuração Backup Criado.", payload: groupdata });
                                                        _events.emit("ContextCreator.Close", id);
                                                        this.reload_Backupper();
                                                    })
                                                    .catch((err) => {
                                                        _events.emit("Info.Erro", { text: "Erro ao criar Configuração de backup.", payload: err });
                                                        this.reload_Backupper();
                                                    })
                                            }
                                        });
                                }
                                backupper_footer.appendChild(Add_Button);

                                this.reload_Backupper();
                            }, 300);
                        });
                    }, document.head)
                }, document.head)
            }, document.head)
        }, document.head)
    }

    //#region Chamadas Servidor
    /**
     * Sobe a lista de Backups na tabela
     * @param {JSON} ListUsers 
     */
    load_groups(tabulator, err, ListUsers) {
        if (err) { console.error('Erro ao carregar lista de Backups', err); return; }
        if (tabulator == undefined) { console.error('Erro Tabulator is Null', tabulator); return; }
        tabulator.setData(ListUsers);
    }

    /**
     * Realiza um recarregamento da lista de Backups
     */
    reload_Backupper() {
        SocketEmit("Backupper.List", (...args) => { this.load_groups(this.tabulator, ...args); })
    }

    /**
     * Subida de novos dados do Backup (completo)
     * @param {JSON} backupperdata 
     */
    edit_group(backupperdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Backupper.Edit", backupperdata, (err, userupdated) => {
                if (err) { console.error("Erro no retorno do Backup", err) }
                resolv(userupdated)
            })
        })
    }

    /**
     * Exclusão do Backup
     * @param {JSON} backupperdata 
     */
    delete_group(backupperdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Backupper.Delete", backupperdata, (err, userupdated) => {
                if (err) { console.error("Erro no retorno do Backup", err) }
                resolv(userupdated)
            })
        })
    }
    /**
     * Exclusão do Backup
     * @param {JSON} backupperdata 
     */
    active_group(backupperdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Backupper.Active", backupperdata, (err, userupdated) => {
                if (err) { console.error("Erro no retorno do Backup", err) }
                resolv(userupdated)
            })
        })
    }
    /**
     * Subida de novos dados do Backup (completo)
     * @param {JSON} backupperdata 
     */
    add_Backup(backupperdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Backupper.Add", backupperdata, (err, userupdated) => {
                if (err) {
                    console.error("Erro no retorno do Backup", err);
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
                                input: "<input disabled id='backupper.id.edit_" + id_group_edit + "' value='" + row._row.data.id + "'>",
                            },
                            {
                                active: true,
                                name: "Nome",
                                input: "<input id='backupper.nome.edit_" + id_group_edit + "' value='" + row._row.data.nome + "'>",
                            },
                            {
                                active: true,
                                name: "Código",
                                input: "<input id='backupper.code.edit_" + id_group_edit + "' value='" + row._row.data.code + "'>",
                            },
                            {
                                active: true,
                                name: "Descrição",
                                input: "<input id='backupper.descricao.edit_" + id_group_edit + "' value='" + row._row.data.descricao + "'>",
                            },
                            {
                                active: true,
                                name: "Ativo",
                                input: "<input type='checkbox' id='backupper.active.edit_" + id_group_edit + "' " + (row._row.data.ativo == 1 ? 'checked' : '') + ">",
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
                            let uid = document.getElementById('backupper.id.edit_' + id_group_edit).value;
                            let unome = document.getElementById('backupper.nome.edit_' + id_group_edit).value;
                            let ucode = document.getElementById('backupper.code.edit_' + id_group_edit).value;
                            let udescr = document.getElementById('backupper.descricao.edit_' + id_group_edit).value;
                            let uativo = document.getElementById('backupper.active.edit_' + id_group_edit).checked;
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
                                    this.reload_Backupper();
                                })
                                .catch((err) => {
                                    _events.emit("Info.Erro", { text: "Erro ao editar Gruopo.", payload: err });
                                    this.reload_Backupper();
                                })
                        }
                    });
            }
        }, {
            label: "<i class='material-symbols-outlined'>settings_account_box</i><span>Permissões</span>",
            action: (e, row) => {
                let nbackupperdata = row._row.data;

                let tab_screen = document.createElement('div');
                tab_screen.setAttribute('class', 'tab_Screen')
                let id_subscreen = BCypher.generateString();
                tab_screen.setAttribute('id', 'tabscreen_permission_' + id_subscreen)

                _events.emit('ContextCreator.Create', {
                    items: [
                        {
                            active: true,
                            name: "",
                            input: "Grupo: " + nbackupperdata.nome,
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
                        _events.emit("Load.Permissoes.List", 'tabscreen_permission_' + id_subscreen, nbackupperdata.id, false);
                    }, document.head)
                });
            }
        },
        {
            label: "<i class='material-symbols-outlined'>delete</i><span>Excluir</span>",
            action: (e, row) => {
                let ncode = prompt("Confirme o Código para excluir <" + row._row.data.code + ">:");
                if (ncode == row._row.data.code) {
                    let nbackupperdata = row._row.data;
                    nbackupperdata.excluido = (nbackupperdata.excluido == 0 ? 1 : 0);
                    this.delete_group(nbackupperdata).then(() => {
                        this.reload_Backupper();
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
                    let nbackupperdata = row._row.data;
                    nbackupperdata.ativo = (nbackupperdata.ativo == 0 ? 1 : 0);
                    this.active_group(nbackupperdata).then(() => {
                        this.reload_Backupper();
                    }).catch(() => {
                        events.emit("Info.Erro", { texto: "Falha ao realizar operação", payload: err });
                    })
                }
            }
        },
    ]

}

new Tela_Backupper();