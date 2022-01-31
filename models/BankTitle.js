const MainLine = require('./TypeableLine');
const moment = require('moment');

module.exports = class BankTitle extends MainLine {
    constructor(typeableLine) {
        super(typeableLine);
        this.dvFieldOne = this.typeableLine.slice(9, 10);
        this.dvFieldTwo = this.typeableLine.slice(20, 21);
        this.dvFieldThree = this.typeableLine.slice(31, 32);
        this.dvtypeableLine = this.typeableLine.slice(32, 33);
    }

    makeSpecificValidations() {
        this.checkWithModuleTen();
        this.checkWithModuleEleven();
    }

    getAmount() {
        let hasOnlyZeros = true;
        // Lebrar da condição específca de o valor do boleto exceder 10 dígitos
        return [...this.typeableLine.slice(37, 45), '.', ...this.typeableLine.slice(-2)].reduce((accum, curr) => {
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
        let date = new Date("10/07/1997 00:00:00");
        const milliseconds = date.getTime();
        let result = moment(milliseconds);
        let factor = this.getFactor();

        return result.add(factor, "days").format("YYYY-MM-DD");
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

    checkWithModuleTen() {
        // Já pegar o campo reverso para ajudar na multiplicação começando da direita para a esquerda
        let reverseFieldOne = this.typeableLine.slice(0, 9).split('').reverse();
        let reverseFieldTwo = this.typeableLine.slice(10, 20).split('').reverse();
        let reverseFieldThree = this.typeableLine.slice(21, 31).split('').reverse();
        let multiplier = null;

        let dvFieldOne = reverseFieldOne.map((el, index) => {
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

        const dvFieldOneRest = dvFieldOne % 10;
        if (dvFieldOne % 10 === 0) {
            dvFieldOne = (dvFieldOne + 10 - dvFieldOneRest) % 10;
            if (dvFieldOne !== +this.dvFieldOne) {
                throw 'O código verificador do campo 1 não é válido!';
            }
        }
        for (let i = 1; i < 10; i++) {
            if ((dvFieldOne + i) % 10 === 0) {
                dvFieldOne = (dvFieldOne + i - dvFieldOneRest) % 10;
                if (dvFieldOne !== +this.dvFieldOne) {
                    throw 'O código verificador do campo 1 não é válido!';
                }
            }
        }

        let dvFieldTwo = reverseFieldTwo.map((el, index) => {
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

        const dvFieldTwoRest = dvFieldTwo % 10;
        if (dvFieldTwo % 10 === 0) {
            dvFieldTwo = (dvFieldTwo + 10 - dvFieldTwoRest) % 10;
            if (dvFieldTwo !== +this.dvFieldTwo) {
                throw 'O código verificador do campo 2 não é válido!';
            }
        }
        for (let i = 1; i < 10; i++) {
            if ((dvFieldTwo + i) % 10 === 0) {
                dvFieldTwo = (dvFieldTwo + i - dvFieldTwoRest) % 10;
                if (dvFieldTwo !== +this.dvFieldTwo) {
                    throw 'O código verificador do campo 2 não é válido!';
                }
            }
        }

        let dvFieldThree = reverseFieldThree.map((el, index) => {
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

        const dvFieldThreeRest = dvFieldThree % 10;
        if (dvFieldThree % 10 === 0) {
            dvFieldThree = (dvFieldThree + 10 - dvFieldThreeRest) % 10;
            if (dvFieldThree !== +this.dvFieldThree) {
                throw 'O código verificador do campo 2 não é válido!';
            }
        }
        for (let i = 1; i < 10; i++) {
            if ((dvFieldThree + i) % 10 === 0) {
                dvFieldThree = (dvFieldThree + i - dvFieldThreeRest) % 10;
                if (dvFieldThree !== +this.dvFieldThree) {
                    throw 'O código verificador do campo 2 não é válido!';
                }
            }
        }
    }

    checkWithModuleEleven() {
        if (this.dvtypeableLine === 0) {
            throw 'O código verificador do boleto não é válido!';
        }
        const reverseBarCode = this.makeReverseBarCode();
        let multiplier = 2;

        const sum = reverseBarCode.reduce((accum, curr, index) => {
            if (multiplier > 9) {
                multiplier = 2;
            }
            const aux = (curr * multiplier) + accum;
            multiplier++;
            return aux;
        }, 0);

        const result = 11 - (sum % 11);

        if (result === 0 || result === 10 || result === 11) {
            if (this.dvtypeableLine !== 1) {
                throw 'O código verificador do boleto não é válido!';
            }
            return 1;
        }

        return result;
    }

    makeReverseBarCode() {
        return this.getBarCode().slice(3).reverse();
    }

    getBarCode() {
        const bankCode = this.typeableLine.slice(0, 3).split('');
        const coin = this.typeableLine.slice(3, 4).split('');
        const factor = this.getFactor();
        const amount = this.typeableLine.slice(37, 48).split('');

        // Já pegar o campo reverso para ajudar na multiplicação começando da direita para a esquerda
        const freeField = [
            ...this.typeableLine.slice(21, 31),
            ...this.typeableLine.slice(10, 20),
            ...this.typeableLine.slice(4, 9),
        ];

        return [
            ...bankCode,
            this.dvtypeableLine,
            ...coin,
            ...factor,
            ...amount,
            ...freeField
        ];
    }
};
