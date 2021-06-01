/**
 * Consulta um CNPJ Criado por Guichaguri
 * https://gist.github.com/Guichaguri/e6b1c41b56e9b2787074fcc8e9602c6d
 */
function consultaCNPJ(cnpj) {
    // Limpa o CNPJ para conter somente numeros, removendo traços e pontos
    cnpj = cnpj.replace(/\D/g, '');

    // Consulta o CNPJ na ReceitaWS com 60 segundos de tempo limite
    return jsonp('https://www.receitaws.com.br/v1/cnpj/' + encodeURI(cnpj), 60000)
        .then((json) => {
            if (json['status'] === 'ERROR') {
                return Promise.reject(json['message']);
            } else {
                return Promise.resolve(json);
            }
        });
}

/**
 * Consulta um CNPJ Criado por Guichaguri
 * https://gist.github.com/Guichaguri/e6b1c41b56e9b2787074fcc8e9602c6d
 */
function consultaCEP(cep) {
    // Limpa o CEP para conter somente numeros, removendo traços e pontos
    cep = cep.replace(/\D/g, '');

    // Como a API retorna 404 com CEPs com tamanhos inválidos
    // Iremos validar antes para não ter que esperar o tempo limite do JSONP
    if (cep.length !== 8) return Promise.reject('CEP inválido');

    // Consulta o CEP na ViaCEP com 30 segundos de tempo limite
    return jsonp('https://viacep.com.br/ws/' + encodeURI(cep) + '/json/', 30000)
        .then((json) => {
            if (json['erro'] === true) {
                return Promise.reject('CEP não encontrado');
            } else {
                return Promise.resolve(json);
            }
        });
}

/**
 * Implementação da requisição na web
 */

function jsonp(url, timeout) {
    // Gera um nome aleatório para a função de callback
    const func = 'jsonp_' + Math.random().toString(36).substr(2, 5);

    return new Promise(function (resolve, reject) {
        // Cria um script
        let script = document.createElement('script');

        // Cria um timer para controlar o tempo limite
        let timer = setTimeout(() => {
            reject('Tempo limite atingido');
            document.body.removeChild(script);
        }, timeout);

        // Cria a função de callback
        window[func] = (json) => {
            clearTimeout(timer);
            resolve(json);
            document.body.removeChild(script);
            delete window[func];
        };

        // Adiciona o script na página para inicializar a solicitação
        script.src = url + '?callback=' + encodeURI(func);
        document.body.appendChild(script);
    });
}
