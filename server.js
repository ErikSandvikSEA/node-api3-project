const express = require('express');
const helmet = require('helmet')

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

const requiresPassword = (req, res, next) => {
  const password = req.headers.password
  if(!password) {
    res.status(400).json({
      message: 'Password is required',
    })
  } else if (password !== 'asdf'){
    res.status(401).json({
      message: 'Wrong Password, sry'
    })
  } else {
    next()
  }
}

//global middleware
// server.use(requiresPassword)
server.use(helmet())
server.use(logger)
server.use(express.json())
server.use('/api/posts', postRouter)
server.use('/api/users', userRouter)

server.get('/', (req, res) => {
  res.status(200).json({
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    greeting: process.env.GREETING
  })
  res.send(`<h2>Let's write some middleware!</h2>`);
});


module.exports = server;
