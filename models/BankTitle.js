const dayjs = require('dayjs');

module.exports = class BankTitle {
    constructor(typeableLine) {
        this.typeableLine = typeableLine;
        this.dvFieldOne = this.typeableLine.slice(9, 10);
        this.dvFieldTwo = this.typeableLine.slice(20, 21);
        this.dvFieldThree = this.typeableLine.slice(31, 32);
        this.dvtypeableLine = this.typeableLine.slice(32, 33);
    }

    makeSpecificValidations(main) {
        const fields = {
            // Já pegar o campo reverso para ajudar na multiplicação começando da direita para a esquerda
            reverseFieldOne: this.typeableLine.slice(0, 9).split('').reverse(),
            reverseFieldTwo: this.typeableLine.slice(10, 20).split('').reverse(),
            reverseFieldThree: this.typeableLine.slice(21, 31).split('').reverse()
        };

        main.checkWithModuleTen(this.dvFieldOne, this.dvFieldTwo, this.dvFieldThree, fields);
        this.checkWithModuleEleven();
    }

    getAmount() {
        let hasOnlyZeros = true;
        // Lebrar da condição específca de o valor do boleto exceder 10 dígitos
        return [...this.typeableLine.slice(37, 42), '.', ...this.typeableLine.slice(-2)].reduce((accum, curr) => {
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
        return dayjs("1997-10-07 00:00:00")
            .add(this.getFactor(), "days")
            .format("YYYY-MM-DD");
    }

    getFactor() {
        return [...this.typeableLine.slice(33, 37)].reduce((accum, curr) => {
            if (accum) {
                return accum + curr;
            } else {
                return curr;
            }
        });
    }

    checkWithModuleEleven() {
        if (+this.dvtypeableLine === 0) {
            throw new Error(
                'O código verificador do boleto não é válido!'
            );
        }
    }
};
