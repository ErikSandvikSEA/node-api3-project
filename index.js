require('dotenv').config()

// code away!
const server = require('./server.js');
const port = process.env.PORT || 6000

server.listen(port, () => {
  console.log(`\n* Server Running on either the heroku app or http://localhost:${port} *\n`);
});
