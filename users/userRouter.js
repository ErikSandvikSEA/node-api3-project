const express = require('express');
const Users = require('./userDb')
const Posts = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  const newUser = req.body
  Users.insert(newUser)
      .then(postedNewUser => {
        res.status(201).json({
          postedNewUser
        })
      })
      .catch(err => {
        console.log(error)
        res.status(500).json({
          err
        })
      })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const userId = req.params.id
  const postToAdd = {
    ...req.newPost,
    user_id: userId
  }

  Posts.insert(postToAdd)
    .then(postedPost => {
      res.status(200).json({
        message: 'Successfully added post',
        brandNewPost: postedPost
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        error,
        message: 'Error occurred while posting'
      })
    })
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
  const user = req.user
  Users.getUserPosts(user.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        error: error,
        message: "Could not retrieve posts"
      })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  const user = req.user
  Users.remove(user.id)
    .then(numberOfDeletedUsers => {
      if(numberOfDeletedUsers === 1){
        res.status(200).json({
          numberOfDeletedUsers: numberOfDeletedUsers,
          message: 'User successfully deleted'
        })
      } else {
        res.status(500).json({
          message: 'Error occurred while deleting'
        })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: 'Could not delete User',
        error: error
      })
    })  
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const updatedUser = req.body
  const user = req.user
  Users.update(user.id, updatedUser)
    .then(numberOfUpdatedUsers => {
      if(numberOfUpdatedUsers === 1){
        res.status(200).json({
          numberOfUpdatedUsers: numberOfUpdatedUsers,
          updates: updatedUser,
          message: 'User successfully updated'
        })
      } else {
        res.status(500).json({
          message: 'Error occurred while updating'
        })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: 'Could not update User',
        error: error
      })
    })
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
    res.status(400).json({ message: "missing user data" })
  } else if(!newUser.name){
    res.status(400).json({ message: "missing required name field" })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  const newPost = req.body
  if(!newPost){
    res.status(400).json({message: 'missing post data'})
  } else if (!newPost.text){
    res.status(400).json({ message: 'missing required text field' })
  } else {
    req.newPost = newPost
    next()
  }
}

function requiredProperties(properties) {
  
}

module.exports = router;
