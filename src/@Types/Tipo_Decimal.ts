


/**
 * Classe primaria para extensão de demais classes
 */
class float {
    // Valor do registro
    private valor!: number;

    // Valor máximo aceito pelo tipo de variavel
    max_valor: number = 2147483647.0;

    // Valor minimo aceito pelo tipo de variavel
    min_valor: number = -2147483647.0;

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
            this.valor = parseFloat((novoValor % (this.max_valor + Math.abs(this.min_valor)) + this.min_valor).toFixed(20));
            return;
        } else if (this.valor !== novoValor) {
            this.valor = parseFloat(novoValor.toFixed(20));
        } else {
            return;
        }
    }

}

/**
 * Tipo de variavel Inteiro Sem sinal
 * Valores limite de 32 Bits
 */
class ufloat32 extends float {

    constructor() {
        super();
        // Valor máximo aceito pelo tipo de variavel
        this.max_valor = 4294967295.0;

        // Valor minimo aceito pelo tipo de variavel
        this.min_valor = 0.0;
    }
}


/**
 * Tipo de variavel Inteiro com sinal
 * Valores limite de 32 Bits
 */
class float32 extends float {

    constructor() {
        super();
    }
}


export { ufloat32, float32 }