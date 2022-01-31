module.exports = class TypeableLine {
    constructor(typeableLine) {
        this.typeableLine = typeableLine;
    }

    checkIfIsValid() {
        if ((this.typeableLine.length !== 47 && this.typeableLine.length !== 48)) {
            return false;
        }
        return true;
    }

    getSpecificChild() {
        return this.typeableLine.length === 47 ? 'BankTitle' : 'DealershipPayment';
    }
};