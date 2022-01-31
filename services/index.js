const TypeableLine = require('../models/TypeableLine');
const BankTitle = require('../models/BankTitle');
const DealershipPayment = require('../models/DealershipPayment');

module.exports = {
    checkIfIsValidAndReturnData(req, res) {
        const typeableLine = req.params.typeableLine;
        const mainline = new TypeableLine(typeableLine);
        let childLine = {};

        if (mainline.checkIfIsValid()) {
            childLine = mainline.getSpecificChild() === 'BankTitle' ? new BankTitle(typeableLine) : new DealershipPayment(typeableLine);
            try {
                childLine.makeSpecificValidations();
                res.status(200).send({
                    barCode: childLine.getBarCode().join(''),
                    amount: childLine.getAmount(),
                    expirationDate: childLine.getExpirationDate(),
                })
            } catch (error) {
                res.status(400).send({
                    errorMessage: error
                });
            }
        } else {
            res.status(400).send({
                errorMessage: 'A linha digitável não contém a quantidade de dígitos esperada ou contém letras.'
            });
        }
    },
}