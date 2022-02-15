const services = require('../services/index');

describe('Validação das linhasdigitáveis', () => {
    it('Linha digitável válida (Título bancário)', () => {
        const response = services.checkIfIsValidAndReturnData({
            params: {
                typeableLine: '34191.79001 01043.510047 91020.150008 9 87820026300'
            }
        });
        const expectedToBe = {
            barCode: '34191790010104351004791020150008987820026300',
            amount: '263.00',
            expirationDate: '2021-10-23'
        };

        return expect(response).toMatchObject(expectedToBe);
    })

    it('Dígito verificador inválido (Título bancário)', () => {
        const response = services.checkIfIsValidAndReturnData({
            params: {
                typeableLine: '34191.79002 01043.510047 91020.150008 9 87820026300'
            }
        });
        const expectedToBe = {
            errorMessage: 'O dígito verificador do campo 1 não é válido!',
        };

        return expect(response).toMatchObject(expectedToBe);
    })

    it('Linha digitável com quantidade de dígitos menor do que 44 (Título bancário)', () => {
        const response = services.checkIfIsValidAndReturnData({
            params: {
                typeableLine: '34191.79002 01043.510047 91020.150008  87820026300'
            }
        });
        const expectedToBe = {
            errorMessage: 'A linha digitável não contém a quantidade de dígitos esperada ou contém letras.'
        };

        return expect(response).toMatchObject(expectedToBe);
    })

    it('Linha digitável com quantidade de dígitos maior do que 44 (Título bancário)', () => {
        const response = services.checkIfIsValidAndReturnData({
            params: {
                typeableLine: '34191.79002 01043.510047 91020.150008 98 87820026300'
            }
        });
        const expectedToBe = {
            errorMessage: 'A linha digitável não contém a quantidade de dígitos esperada ou contém letras.'
        };

        return expect(response).toMatchObject(expectedToBe);
    })

    it('Linha digitável contém letras (Título bancário)', () => {
        const response = services.checkIfIsValidAndReturnData({
            params: {
                typeableLine: '34191.79002 01043.510047 a 91020.150008 98 87820026300'
            }
        });
        const expectedToBe = {
            errorMessage: 'A linha digitável não contém a quantidade de dígitos esperada ou contém letras.'
        };

        return expect(response).toMatchObject(expectedToBe);
    })

    it('Linha digitável válida (Pagamento de concessionária)', () => {
        const response = services.checkIfIsValidAndReturnData({
            params: {
                typeableLine: '83680000003-3 00230048100-5 22218056921-2 00183609383-9'
            }
        });
        const expectedToBe = {
            barCode: '836800000033002300481005222180569212001836093839',
            amount: '300.23',
            expirationDate: 'Não tem data de validade'
        };

        return expect(response).toMatchObject(expectedToBe);
    })

    it('Linha digitável diferente de 48 digitos (Pagamento de concessionária)', () => {
        const response = services.checkIfIsValidAndReturnData({
            params: {
                typeableLine: '83680000003-3 600230048100-5 22218056921-2 00183609383-9'
            }
        });
        const expectedToBe = {
            errorMessage: 'A linha digitável não contém a quantidade de dígitos esperada ou contém letras.'
        };

        return expect(response).toMatchObject(expectedToBe);
    })

    it('Linha digitável válida (Pagamento de concessionária)', () => {
        const response = services.checkIfIsValidAndReturnData({
            params: {
                typeableLine: '83680000003-3 00230048100-6 22218056921-2 00183609383-9'
            }
        });
        const expectedToBe = {
            errorMessage: 'O dígito verificador do campo 2 não é válido!',
        };

        return expect(response).toMatchObject(expectedToBe);
    })
});