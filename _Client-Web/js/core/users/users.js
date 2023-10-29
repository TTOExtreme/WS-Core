
class Tela_Users {

    // Id da tela
    id_tela = null;
    // Elemento da tela
    Tela = null;
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

        console.log(this.Tela)

        this.Tela.innerHTML = "<h3>ID Tela: " + this.id_tela + "</h3>";

    }
}

new Tela_Users();