

window.onload(function (ev) {
    /**
     * Carregar do servidor usando fetch para os dados iniciais
     * Bloco 1:
     *      - Menus
     *      - Redes sociais
     * Bloco 2: 
     *      - Noticias principais
     */

    let body = {
        menus: [
            {
                id: 0,
                name: "nome-1",
                img: "/img/img.png",
                href: "http://...",
            }
        ],
        redesSociais: [
            {
                id: 0,
                name: "nome-1",
                img: "/img/img.png",
                href: "http://...",
            }
        ]
    }

    set_Menus_topBar(body);




    /**
     * Estrutura para funcionamento com a base de dados:
     *//*
 fetch("./api/get/header")
     .then(data => {
         /**
          * Estrutura do data
          * {
          *     status: 200, //sucesso de request
          *     body: {
          *         menus:[
          *             {
          *                 id:0,
          *                 name:"nome-1",
          *                 img:"/img/img.png",
          *                 href:"http://...",
          *                 
          *             }
          *         ]
          *     }
          * }
          *
         if (data.status == 200) {
             data.json().then(body => {
                 /**
                  * tratar retorno de dados inserindo os nas tags
                  * 
                  *
             })
         } else {
             /**
              * TODO:
              * Tratamento de erro de request
              *
         }

     })
     //*/
});

/**
 * Receber estrutura do banco e inseri-la na pagina
 *  - Menus
 * @param {JSON} data 
 */
function set_Menus_topBar(data) {

}

function set_