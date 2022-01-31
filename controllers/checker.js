const services = require('../services/index.js');

module.exports = app => {
    app.get('/boleto/:typeableLine', (req, res) => services.checkIfIsValidAndReturnData(req, res));
}