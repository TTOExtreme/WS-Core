


/**
 * Classe primaria para extensão de demais classes
 */
class int {

    /**
     * Metodos de inicialização com valor
     */
    constructor() {
    }

    // Valor do registro
    private valor!: number;

    // Valor máximo aceito pelo tipo de variavel
    max_valor: number = 2147483647;

    // Valor minimo aceito pelo tipo de variavel
    min_valor: number = -2147483647;

    /**
     * Função de Get onde retorna o valor salvo em memória
     */
    get value(): number {
        return this.valor;
    }

    /**
     * Função set para armazenamento e validação de formato de valor dentre o range do tipo de variavel
     * @param novoValor Valor de input para a classe
     */
    set value(novoValor: number) {
        if (novoValor > this.max_valor || novoValor < this.min_valor) {
            this.valor = Math.floor(novoValor % (this.max_valor + Math.abs(this.min_valor)) + this.min_valor);
            return;
        } else if (this.valor !== novoValor) {
            this.valor = Math.floor(novoValor);
        } else {
            return;
        }
    }

}

/**
 * Tipo de variavel Inteiro Sem sinal
 * Valores limite de 8 Bits
 */
class uint8 extends int {

    constructor(valor?: number) {
        super();
        // Valor máximo aceito pelo tipo de variavel
        this.max_valor = 255;

        // Valor minimo aceito pelo tipo de variavel
        this.min_valor = 0;

        // insere o valor em memoria depois da declaração do min/max
        if (valor != undefined)
            this.value = valor;
    }
}

/**
 * Tipo de variavel Inteiro Com sinal
 * Valores limite de 8 Bits
 */
class int8 extends int {

    constructor(valor?: number) {
        super();
        // Valor máximo aceito pelo tipo de variavel
        this.max_valor = 127;

        // Valor minimo aceito pelo tipo de variavel
        this.min_valor = -127;

        // insere o valor em memoria depois da declaração do min/max
        if (valor != undefined)
            this.value = valor;
    }
}


/**
 * Tipo de variavel Inteiro Sem sinal
 * Valores limite de 16 Bits
 */
class uint16 extends int {
    constructor(valor?: number) {
        super();
        // Valor máximo aceito pelo tipo de variavel
        this.max_valor = 65535;

        // Valor minimo aceito pelo tipo de variavel
        this.min_valor = 0;

        // insere o valor em memoria depois da declaração do min/max
        if (valor != undefined)
            this.value = valor;
    }
}

/**
 * Tipo de variavel Inteiro Com sinal
 * Valores limite de 16 Bits
 */
class int16 extends int {

    constructor(valor?: number) {
        super();
        // Valor máximo aceito pelo tipo de variavel
        this.max_valor = 32767;

        // Valor minimo aceito pelo tipo de variavel
        this.min_valor = -32767;

        // insere o valor em memoria depois da declaração do min/max
        if (valor != undefined)
            this.value = valor;
    }
}


/**
 * Tipo de variavel Inteiro Sem sinal
 * Valores limite de 32 Bits
 */
class uint32 extends int {

    constructor(valor?: number) {
        super();
        // Valor máximo aceito pelo tipo de variavel
        this.max_valor = 4294967295;

        // Valor minimo aceito pelo tipo de variavel
        this.min_valor = 0;

        // insere o valor em memoria depois da declaração do min/max
        if (valor != undefined)
            this.value = valor;
    }
}


/**
 * Tipo de variavel Inteiro com sinal
 * Valores limite de 32 Bits
 */
class int32 extends int {

    constructor(valor?: number) {
        super();

        // insere o valor em memoria depois da declaração do min/max
        if (valor != undefined)
            this.value = valor;
    }
}


export { uint8, int8, uint16, int16, uint32, int32 }