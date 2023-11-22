class Tela_Modulos {

    // Id da tela
    id_tela = null;
    // Elemento da tela
    Tela = null;
    //instancia do Tabulator na tela
    tabulator = null;

    //estrutura da tabela
    columns = [
        {
            title: "Nome",
            field: "nome",
            headerFilter: "input",
            resizable: true
        },
        {
            title: "Instalado",
            field: "instalado",
            headerFilter: "list",
            headerFilterParams: { values: { 1: "Sim", 0: "Não", "": "-" }, clearable: true },
            formatter: 'tickCross',
            resizable: true
        }
    ]


    constructor() {
        _events.on("Start.Tela.Lista_Modulos", (id_aba) => {
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
        this.Tela.innerHTML += "<div id='modulos_table_" + this.id_tela + "'></div>";

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
                        this.TableHandler.config.footerElement = "<div id='Modulos_Tabulator_Footer" + id_aba + "'>";

                        /**
                         * Configura as ações do botao direito em cada Linha
                         */
                        this.TableHandler.config.rowContextMenu = this.rowMenu;

                        /**
                         * Altera as configurações de Colunas e persistenceID
                         */
                        this.TableHandler.config.columns = this.columns;
                        this.TableHandler.config.persistenceID = "Modulos_Table";

                        this.TableHandler.Setup_tabulator('#modulos_table_' + this.id_tela, (tabulator_instance) => {
                            this.tabulator = tabulator_instance;
                            setTimeout(() => {

                                let modulos_footer = document.getElementById('Modulos_Tabulator_Footer' + id_aba);
                                modulos_footer.style.marginRight = '10px'
                                let Reload_Button = document.createElement('a');
                                Reload_Button.innerHTML = "<i class='material-symbols-outlined'>refresh</i>";
                                Reload_Button.setAttribute('class', 'tabulator-page')
                                Reload_Button.onclick = () => {
                                    this.reload_modulos();
                                }
                                modulos_footer.appendChild(Reload_Button);



                                this.reload_modulos();
                            }, 300);
                        });
                    }, document.head)
                }, document.head)
            }, document.head)
        }, document.head)
    }

    //#region Chamadas Servidor
    /**
     * Sobe a lista de Modulos na tabela
     * @param {JSON} ListModulos 
     */
    load_modulos(tabulator, err, ListModulos) {
        if (err) { console.error('Erro ao carregar lista de Modulos', err); return; }
        if (tabulator == undefined) { console.error('Erro Tabulator is Null', tabulator); return; }
        tabulator.setData(ListModulos);
    }

    /**
     * Realiza um recarregamento da lista de Modulos
     */
    reload_modulos() {
        SocketEmit("Modulos.List", (...args) => { this.load_modulos(this.tabulator, ...args); })
    }

    /**
     * Exclusão do usuário
     * @param {String} nome_modulo 
     */
    install_modulos(nome_modulo = "") {
        return new Promise((resolv, reject) => {
            SocketEmit("Modulo." + nome_modulo.replace("Modulo_", "") + ".Install", (err, data) => {
                if (err) {
                    console.error("Erro na instalação do Modulo", err);
                    reject(err);
                    return;
                }
                resolv(null, data);
            })
        })
    }
    //#endregion


    /**
     * Configura as ações do botao direito em cada Linha
     */
    rowMenu = [
        {
            label: "<i class='material-symbols-outlined'>deployed_code_update</i><span>Instalar</span>",
            action: (e, row) => {
                let nEmail = prompt("Digite 'SIM' para instalar o modulo<" + row._row.data.nome + ">:");
                if (nEmail != null && nEmail == "SIM") {
                    let nuserdata = row._row.data;

                    this.install_modulos(nuserdata.nome).then((err, data) => {
                        _events.emit("Info.Ok", { texto: "Instalado com sucesso", payload: data });
                        this.reload_modulos();
                    }).catch((err) => {
                        _events.emit("Info.Erro", { texto: "Falha ao realizar operação", payload: err });
                    })
                }
            }
        }

    ]

}

new Tela_Modulos();