/**
 * Cria uma tela, e instancia a sessão para que haja multiplas da mesma
 */


class instancia_Telas {

    //
    _lista_telas = {};

    constructor() {

    }

    /**
     * Instancia a tela a ser chamada
     * @param {String} id id da tela a ser criada (caso ja exista somente a traz para frente)
     * @returns {Element}
     */
    CreateScreen(id = BCypher.generateString()) {
        let tela_div = this.GetScreen(id, false);
        if (tela_div == null) {
            const ms = document.getElementById('middle_screen');
            tela_div = document.createElement('div');
            tela_div.setAttribute('id', "Tela_" + id);
            tela_div.setAttribute('class', "middle_screen_tela");
            this._lista_telas[id] = {
                element: tela_div
            }
            ms.appendChild(tela_div);
        }
        return tela_div;
    }

    /**
     * Retorna a instancia da tela caso exista, senao retorna Nulo
     * @param {String} id Id da tela a ser retornada
     * @param {Boolean} echo Se deve enviar erros para o console
     * @returns {JSON|Null} Instancia da tela
     */
    GetScreen(id = null, echo = true) {
        if (id == null | id == undefined) {
            if (echo) {
                console.error("[ERRO] Tela Indefinida", id);
            }
            return null;
        }
        for (let index = 0; index < Object.keys(this._lista_telas).length; index++) {
            const tela_id = Object.keys(this._lista_telas)[index];
            if (tela_id == id) {
                return this._lista_telas[tela_id]
            }
        }
        if (echo) {
            console.error("[ERRO] Tela nao encontrada", id);
        }
        return null;
    }
}

let TelaPrincipal = new instancia_Telas();