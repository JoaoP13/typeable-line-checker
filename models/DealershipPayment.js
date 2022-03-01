module.exports = class DealershipPayment {
    constructor(typeableLine) {
        this.typeableLine = typeableLine;
        this.dvFieldOne = this.typeableLine.slice(11, 12);
        this.dvFieldTwo = this.typeableLine.slice(23, 24);
        this.dvFieldThree = this.typeableLine.slice(35, 36);
    }

    makeSpecificValidations(main) {
        const fields = {
            // Já pegar o campo reverso para ajudar na multiplicação começando da direita para a esquerda
            reverseFieldOne: this.typeableLine.slice(0, 11).split('').reverse(),
            reverseFieldTwo: this.typeableLine.slice(12, 23).split('').reverse(),
            reverseFieldThree: this.typeableLine.slice(24, 35).split('').reverse()
        };

        main.checkWithModuleTen(this.dvFieldOne, this.dvFieldTwo, this.dvFieldThree, fields)
        return;
    }

    getAmount() {
        let hasOnlyZeros = true;
        // Lembrar da condição específca de o valor do boleto exceder 10 dígitos
        return [...this.typeableLine.slice(4, 11), ...this.typeableLine.slice(12, 14), '.', ...this.typeableLine.slice(14, 16)].reduce((accum, curr) => {
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
};
