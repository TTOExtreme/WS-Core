


/**
 * Classe primaria para extensão de demais classes
 */
class String {
    // Valor do registro
    private valor!: string;

    // Valor máximo de caracteres aceito pelo tipo de variavel
    max_comprimento: number = 255;


    /**
     * Função de Get onde retorna o valor salvo em memória
     */
    get value(): string {
        return this.valor;
    }

    /**
     * Função set para armazenamento e validação de comprimento da string
     * @param novoValor Valor de input para a classe
     */
    set value(novoValor: string) {
        if (novoValor.length > this.max_comprimento) {
            this.valor = novoValor.substring(0, this.max_comprimento - 1);
        } else if (this.valor !== novoValor) {
            this.valor = novoValor;
        } else {
            return;
        }
    }

}

/**
 * Tipo de variavel String
 * Valores limite de 255 caracteres
 */
class String_255 extends String {
    constructor() {
        super();
        // Valor máximo do comprimento da variavel aceito pelo tipo de variavel
        this.max_comprimento = 255;
    }
}

/**
 * Tipo de variavel String
 * Valores limite de 32767 caracteres
 */
class String_32k extends String {
    constructor() {
        super();
        // Valor máximo do comprimento da variavel aceito pelo tipo de variavel
        this.max_comprimento = 32767;
    }
}

/**
 * Tipo de variavel String
 * Valores limite de 65535 caracteres
 */
class String_64k extends String {
    constructor() {
        super();
        // Valor máximo do comprimento da variavel aceito pelo tipo de variavel
        this.max_comprimento = 65535;
    }
}

/**
 * Tipo de variavel String
 * Valores limite de 131071 caracteres
 */
class String_128k extends String {
    constructor() {
        super();
        // Valor máximo do comprimento da variavel aceito pelo tipo de variavel
        this.max_comprimento = 131071;
    }
}

/**
 * Tipo de variavel String
 * Valores limite de 16777215 caracteres
 */
class String_16m extends String {
    constructor() {
        super();
        // Valor máximo do comprimento da variavel aceito pelo tipo de variavel
        this.max_comprimento = 16777215;
    }
}



export { String_255, String_32k, String_64k, String_128k, String_16m }