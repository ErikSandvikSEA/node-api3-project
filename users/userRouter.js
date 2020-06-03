const express = require('express');
const Users = require('./userDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  res.status(201).json({
    message: 'New user posted!',
    user: req.postedNewUser,
  })
});

router.post('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
});

router.get('/', (req, res) => {
  Users.get(req.query)
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'Error retrieving the posts',
        error: err
      })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if(user) {
        req.user = user
        next()
      } else {
        res.status(404).json({ message: 'User not found, sry' })
      }
    })
    .catch(err => {
      console.log(error)
      res.status(500).json({
        message: 'Error retrieving the user'
      })
    })
}

function validateUser(req, res, next) {
  const newUser = req.body
  if(!newUser){
    res.status(404).json({ message: "missing user data" })
  } else if(!newUser.name){
    res.status(404).json({ message: "missing required name field" })
  } else {
    Users.insert(newUser)
      .then(postedNewUser => {
        req.postedNewUser = postedNewUser
        next()
      })
      .catch(err => {
        console.log(error)
        res.status(500).json({
        })
      })
  }
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
