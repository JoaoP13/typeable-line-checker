const BankTitle = require('./BankTitle');
const DealershipPayment = require('./DealershipPayment');

const MAX_BANK_DIGITS = 44;
const MAX_DEALERSHIP_DIGITS = 48;

let actual_field = 1;

module.exports = class TypeableLine {
    constructor(typeableLine) {
        this.typeableLine = typeableLine.replace(/[^0-9]+/g, "");
    }

    checkIfIsValid() {
        if ((this.typeableLine.length !== MAX_BANK_DIGITS
            && this.typeableLine.length !== MAX_DEALERSHIP_DIGITS)
            // RegEx para checar se tem apenas números
            && /^\d+$/.test(this.typeableLine)
        ) return false;

        return true;
    }

    getSpecificChild() {
        return this.typeableLine.length === MAX_BANK_DIGITS ? new BankTitle(this.typeableLine) : new DealershipPayment(this.typeableLine);
    }

    checkWithModuleTen(dvFieldOne, dvFieldTwo, dvFieldThree, fields) {
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
};