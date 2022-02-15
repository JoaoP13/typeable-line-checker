const { response } = require('express');
const TypeableLine = require('../models/TypeableLine');

module.exports = {
    checkIfIsValidAndReturnData(req, res) {
        const typeableLine = req.params.typeableLine;
        const mainline = new TypeableLine(typeableLine);

        if (mainline.checkIfIsValid()) {
            const childLine = mainline.getSpecificChild();

            try {
                childLine.makeSpecificValidations(mainline);
                const response = {
                    barCode: childLine.typeableLine,
                    amount: childLine.getAmount(),
                    expirationDate: childLine.getExpirationDate ? childLine.getExpirationDate() : 'Não tem data de validade',
                };

                res?.status(200).send(response);
                return response;
            } catch (error) {
                const response = {
                    errorMessage: error.message
                }

                res?.status(400).send(response);
                return response;
            }
        } else {
            const response = {
                errorMessage: 'A linha digitável não contém a quantidade de dígitos esperada ou contém letras.'
            }

            res?.status(400).send(response);
            return response;
        }
    },
}