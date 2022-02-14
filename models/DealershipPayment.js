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

    checkWithModuleTen() {

        const digits = {
            '1': dvFieldOne,
            '2': dvFieldTwo,
            '3': dvFieldThree
        }

        Object.values(fields).forEach((el) => this.checkUniqueDigit(el, digits));
    }

    checkUniqueDigit(field, digits) {
        let multiplier = null;

        let digit = field.map((el, index) => {
            if (index % 2 === 0) {
                multiplier = 2;
            } else {
                multiplier = 1;
            }

            if (+el * multiplier > 9) {
                return ((+el * multiplier) % 10) + 1;
            }

            return +el * multiplier;
        }).reduce((accum, curr) => {
            return accum + curr;
        }, 0);

        const digitRest = digit % 10;

        if (digit % 10 === 0) {
            digit = (digit + 10 - digitRest) % 10;
            if (digit !== +digits[actual_field]) {
                throw new Error(
                    `O código verificador do campo ${actual_field} não é válido!`
                );
            }
        }

        for (let i = 1; i < 10; i++) {
            if ((digit + i) % 10 === 0) {
                digit = (digit + i - digitRest) % 10;
                if (digit !== +digits[actual_field]) {
                    throw new Error(
                        `O código verificador do campo ${actual_field} não é válido!`
                    );
                }
            }
        }

        actual_field === 3 ? actual_field = 1 : actual_field++;
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
