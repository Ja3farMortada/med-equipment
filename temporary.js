const server = require('./server');

// Initialize express server api
server.listen(3000, () => console.log(`listening on port ${3000} ...`));