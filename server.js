const express = require('express');

const postRouter = require('./posts/postRouter')
const userRouter = require('./users/userRouter')

const server = express();

//custom middleware

function logger(req, res, next) {
  const seconds = new Date().getSeconds()
  const minutes = new Date().getMinutes()
  console.log(`|| Method: ${req.method} `, `|| URL: http://localhost:6000${req.url} `, `|| Timestamp: ${minutes} minutes and ${seconds} seconds`)
  next()
}

//global middleware
server.use(logger)
server.use(express.json())
server.use('/api/posts', postRouter)
server.use('/api/users', userRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});


module.exports = server;
