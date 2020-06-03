const express = require('express');

const postRouter = require('./posts/postRouter')

const server = express();

//custom middleware

function logger(req, res, next) {
  const date = new Date().getSeconds()
  console.log(`|| Method: ${req.method} `, `|| URL: http://localhost:6000${req.url} `, `|| Timestamp: ${date} seconds`)
  next()
}

//global middleware
server.use(logger)
server.use(express.json())
server.use('/api/posts', postRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});


module.exports = server;
