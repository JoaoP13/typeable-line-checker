const customExpress = require('./config/config');

const app = customExpress();

app.listen(8080, () => console.log('Server is running on port 8080'));
