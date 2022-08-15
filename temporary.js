const server = require('./server');
const keys = require('./keys.json');

// Initialize express server api
server.listen(keys.port, () => console.log(`listening on port ${keys.port} ...`));