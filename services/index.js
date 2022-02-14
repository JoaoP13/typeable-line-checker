const TypeableLine = require('../models/TypeableLine');

module.exports = {
    checkIfIsValidAndReturnData(req, res) {
        const typeableLine = req.params.typeableLine;
        const mainline = new TypeableLine(typeableLine);

        if (mainline.checkIfIsValid()) {
            const childLine = mainline.getSpecificChild();

            try {
                childLine.makeSpecificValidations(mainline);
                res.status(200).send({
                    barCode: childLine.typeableLine,
                    amount: childLine.getAmount(),
                    expirationDate: childLine.getExpirationDate ? childLine.getExpirationDate() : 'Não tem data de validade',
                })
            } catch (error) {
                res.status(400).send({
                    errorMessage: error.message
                });
            }
        } else {
            res.status(400).send({
                errorMessage: 'A linha digitável não contém a quantidade de dígitos esperada ou contém letras.'
            });
        }
    },
}