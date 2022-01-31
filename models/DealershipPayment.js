const MainLine = require('./TypeableLine');

module.exports = class DealershipPayment extends MainLine {
    constructor(typeableLine) {
        super(typeableLine);
        // this.dvFieldOne = this.typeableLine.slice(11, 12);
        // this.dvFieldTwo = this.typeableLine.slice(23, 24);
        // this.dvFieldThree = this.typeableLine.slice(35, 36);
        // this.dvFieldFour = this.typeableLine.slice(47, 48);
    }

    makeSpecificValidations() {
        // A função está vazia pois não consegui entender, pela documentação, com clareza qual dos módulos deve ser implementado para validação dos dígitos
        // Também consultei este fórum como referência, mas que usa apenas módulo 10: https://groups.google.com/g/jrimum-community/c/yjNuKS-MwxA
        return;
    }

    // Poderia ser melhorado a distribuição dos métodos na classe mãe (no caso getAmount se repete)
    getAmount() {
        let hasOnlyZeros = true;
        // Lembrar da condição específca de o valor do boleto exceder 10 dígitos
        return [...this.typeableLine.slice(4, 14), '.', ...this.typeableLine.slice(14, 16)].reduce((accum, curr) => {
            if (+curr > 0) {
                hasOnlyZeros = false;
                if (accum) {
                    return accum + curr;
                } else {
                    return curr;
                }
            } else if (!hasOnlyZeros) {
                return accum + curr;
            }
        });
    }

    getExpirationDate() {
        return [
            this.typeableLine.slice(29, 33),
            this.typeableLine.slice(33, 35),
            this.typeableLine.slice(36, 38),
        ].join('-');
    }

    getBarCode() {
        return [
            this.typeableLine.slice(0, 11),
            this.typeableLine.slice(12, 23),
            this.typeableLine.slice(24, 35),
            this.typeableLine.slice(36, 47),
        ];
    }
};
