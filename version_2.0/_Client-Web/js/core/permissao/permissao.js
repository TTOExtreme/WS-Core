
class Tela_Permissao {

    // Id da tela
    id_tela = null;
    // Elemento da tela
    Tela = null;
    //instancia do Tabulator na tela
    tabulator = null;

    //ID do Usuario em questão
    ID_Registro = null;

    //ID do Grupo em questao
    Tipo_Registro = 'User';

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
            title: "Código",
            field: "permissao",
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
            headerFilter: "select",
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
            headerFilter: "select",
            headerFilterParams: { values: { 1: "Ativo", 0: "Inativo", "": "-" }, clearable: true },
            formatter: 'tickCross',
            resizable: true
        },
        {
            title: "Permitir",
            field: "tipo",
            headerFilter: "select",
            headerFilterParams: { values: { 1: "Permitir", 2: "Negar", "": "-" }, clearable: true },
            formatter: this.Formatter_Tipo,
            resizable: true
        }
    ]


    constructor() {
        _events.on("Load.Permissoes.List", (id_aba, id_registro, isUser = true) => {
            this.ID_Registro = id_registro;
            if (isUser) {
                this.Tipo_Registro = 'Users'
            } else {
                this.Tipo_Registro = 'Grupo'
            }
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
                        this.TableHandler.config.footerElement = "<div id='Perm_Tabulator_Footer_" + this.id_tela + "'>";

                        /**
                         * Reduz a largura da tabela
                         */
                        this.TableHandler.config.height = "calc(100vh - 150px)";
                        this.TableHandler.config.width = "calc(500vw)";

                        /**
                         * Configura as ações do botao direito em cada Linha
                         */
                        this.TableHandler.config.rowContextMenu = this.rowMenu;

                        /**
                         * Altera as configurações de Colunas e persistenceID
                         */
                        this.TableHandler.config.columns = this.columns;
                        this.TableHandler.config.persistenceID = "permissao_Table";

                        this.TableHandler.Setup_tabulator('#' + this.id_tela, (tabulator_instance) => {
                            this.tabulator = tabulator_instance;
                            window.tabs = tabulator_instance;

                            this.tabulator.element.style.width = "50vw"
                            setTimeout(() => {

                                let users_footer = document.getElementById("Perm_Tabulator_Footer_" + this.id_tela + "");
                                users_footer.style.marginRight = '10px'
                                let Reload_Button = document.createElement('a');
                                Reload_Button.innerHTML = "<i class='material-symbols-outlined'>refresh</i>";
                                Reload_Button.setAttribute('class', 'tabulator-page')
                                Reload_Button.onclick = () => {
                                    this.reload_Permisao();
                                }
                                users_footer.appendChild(Reload_Button);
                                this.reload_Permisao();
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
    load_Permisao(tabulator, err, ListUsers) {
        if (err) { console.error('Erro ao carregar lista de usuários', err); return; }
        if (tabulator == undefined) { console.error('Erro Tabulator is Null', tabulator); return; }
        tabulator.setData(ListUsers);
    }

    /**
     * Realiza um recarregamento da lista de usuários
     */
    reload_Permisao() {
        SocketEmit("Permissao." + this.Tipo_Registro + ".List", this.ID_Registro, (...args) => { this.load_Permisao(this.tabulator, ...args); })
    }

    /**
     * Subida de novos dados da permissao (completo)
     * @param {JSON} permdata 
     */
    edit_permissao(permdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Permissao." + this.Tipo_Registro + ".Edit", permdata, (err, userupdated) => {
                if (err) { console.error("Erro no retorno da permissao", err) }
                resolv(userupdated)
            })
        })
    }
    /**
     * Exclusão da permissao
     * @param {JSON} permdata 
     */
    delete_permissao(permdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Permissao." + this.Tipo_Registro + ".Delete", permdata, (err, userupdated) => {
                if (err) { console.error("Erro no retorno da permissao", err) }
                resolv(userupdated)
            })
        })
    }
    /**
     * Exclusão da permissao
     * @param {JSON} permdata 
     */
    active_permissao(permdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Permissao." + this.Tipo_Registro + ".Active", permdata, (err, userupdated) => {
                if (err) { console.error("Erro no retorno da permissao", err) }
                resolv(userupdated)
            })
        })
    }
    /**
     * Subida de novos dados da permissao (completo)
     * @param {JSON} permdata 
     */
    add_permissao(permdata = null) {
        return new Promise((resolv, reject) => {
            SocketEmit("Permissao." + this.Tipo_Registro + ".Add", permdata, (err, userupdated) => {
                if (err) {
                    console.error("Erro no retorno da permissao", err);
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
            label: "<i class='material-symbols-outlined'>person_add</i><span>Alterar Permissão</span>",
            action: (e, row) => {
                let bot_addUser = document.createElement('button');
                bot_addUser.setAttribute('class', 'contextMenu_submit')
                bot_addUser.innerText = (row._row.data.ativo != '-' ? "Alterar" : "Adicionar");
                let id_subscreen = BCypher.generateString();

                _events.emit('ContextCreator.Create',
                    {
                        items: [
                            {
                                active: true,
                                name: "ID Permissão",
                                input: "<input disabled id='Permissao." + this.Tipo_Registro + ".permissaoid.add_" + id_subscreen + "' value='" + row._row.data.id + "' >",
                            },
                            {
                                active: true,
                                name: "Permissao",
                                input: "<input disabled id='Permissao." + this.Tipo_Registro + ".permissao.add_" + id_subscreen + "' value='" + row._row.data.permissao + "' >",
                            },
                            {
                                active: true,
                                name: "ID " + (this.Tipo_Registro == 'Users' ? "Usuário" : "Grupo"),
                                input: "<input disabled id='Permissao." + this.Tipo_Registro + ".userid.add_" + id_subscreen + "' value='" + (this.Tipo_Registro == 'Users' ? row._row.data.user_id : row._row.data.group_id) + "'>",
                            },
                            {
                                active: true,
                                name: "Ativo",
                                input: "<input type='checkbox' " + (row._row.data.ativo == '1' ? "Checked" : "") + " id='Permissao." + this.Tipo_Registro + ".active.add_" + id_subscreen + "'>",
                            },
                            {
                                active: true,
                                name: "Permitir",
                                input: "<input title='Em caso de marcado a permissão é de autorizar, caso desmarcado é de negação' " + (row._row.data.tipo != '2' ? "Checked" : "") + " type='checkbox' id='Permissao." + this.Tipo_Registro + ".tipo.add_" + id_subscreen + "'>",
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
                            let idperm = document.getElementById("Permissao." + this.Tipo_Registro + ".permissaoid.add_" + id_subscreen + "").value;
                            let iduser = document.getElementById("Permissao." + this.Tipo_Registro + ".userid.add_" + id_subscreen + "").value;
                            let uativo = document.getElementById("Permissao." + this.Tipo_Registro + ".active.add_" + id_subscreen + "").checked;
                            let utipo = document.getElementById("Permissao." + this.Tipo_Registro + ".tipo.add_" + id_subscreen + "").checked;
                            if (row._row.data.ativo == '-') {
                                this.add_permissao({
                                    perm_id: idperm,
                                    user_id: iduser,
                                    group_id: iduser,
                                    ativo: (uativo ? 1 : 0),
                                    tipo: (utipo ? 1 : 2)
                                })
                                    .then((permdata) => {
                                        _events.emit("Info.Ok", { text: "Permissão Adicionada.", payload: permdata });
                                        _events.emit("ContextCreator.Close", id);
                                        this.reload_Permisao();
                                    })
                                    .catch((err) => {
                                        _events.emit("Info.Erro", { text: "Erro ao Adicionar Permissão.", payload: err });
                                        this.reload_Permisao();
                                    })
                            } else {
                                this.edit_permissao({
                                    perm_id: idperm,
                                    user_id: iduser,
                                    group_id: iduser,
                                    ativo: (uativo ? 1 : 0),
                                    tipo: (utipo ? 1 : 2)
                                })
                                    .then((permdata) => {
                                        _events.emit("Info.Ok", { text: "Permissão Editada.", payload: permdata });
                                        _events.emit("ContextCreator.Close", id);
                                        this.reload_Permisao();
                                    })
                                    .catch((err) => {
                                        _events.emit("Info.Erro", { text: "Erro ao Editar Permissão.", payload: err });
                                        this.reload_Permisao();
                                    })
                            }
                        }
                    });

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
                    label: "<i class='material-symbols-outlined'>delete</i><span>Excluir</span>",
                    action: (e, row) => {
                        let npermdata = row._row.data;
                        npermdata.excluido = (npermdata.excluido == 0 ? 1 : 0);
                        this.delete_permissao(npermdata).then(() => {
                            this.reload_Permisao();
                        }).catch(() => {
                            events.emit("Info.Erro", { texto: "Falha ao realizar operação", payload: err });
                        })
                    }
                },/*
                {
                    label: "<span class='material-symbols-outlined'>delete</span> Excluir",
                    disabled: true,
                },//*/
                {
                    label: "<i class='material-symbols-outlined'>person_off</i><span>Inativar/Ativar</span>",
                    action: (e, row) => {
                        let npermdata = row._row.data;
                        npermdata.ativo = (npermdata.ativo == 0 ? 1 : 0);
                        this.active_permissao(npermdata).then(() => {
                            this.reload_Permisao();
                        }).catch(() => {
                            events.emit("Info.Erro", { texto: "Falha ao realizar operação", payload: err });
                        })

                    }
                },/*
                {
                    label: "<span class='material-symbols-outlined'>delete</span> Excluir",
                    disabled: true,
                },//*/
            ]
        }
    ]

    Formatter_Tipo(cell, formatterParams, onRendered) {
        var value = cell.getValue(); // Get the cell value

        // Customize the formatting based on the cell value or any other criteria
        if (value === "1") {
            return "<i style='color:lime;'>Permitido</i>"; // Checkmark symbol
        } else if (value === "2") {
            return "<i style='color:red;'>Negado</i>"; // Cross symbol
        } else {
            return '-'; // Return the original value for other cases
        }
    }
}

new Tela_Permissao();