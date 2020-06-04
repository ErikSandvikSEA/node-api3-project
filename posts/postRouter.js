const express = require('express');
const Posts = require('./postDb')

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get(req.query)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'Error retrieving the posts',
        error: err
      })
    })
});

router.get('/:id', validatePostId, (req, res) => {
  const post = req.post
  res.status(200).json(post)
});

router.delete('/:id', validatePostId, (req, res) => {
  const post = req.post
  Posts.remove(post.id)
    .then(numberOfRemovedPosts => {
      res.status(200).json({
        message: `Post #${post.id} has been removed`,
        numberOfRemovedPosts
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: 'Error occurred during deletion' })
    })
});

router.put('/:id', validatePostId, requiredProperty('text'), (req, res) => {
  const updatedPost = req.body
  const postId = req.post.id
  Posts.update(postId, updatedPost)
    .then(numberOfUpdatedPosts => {
      res.status(200).json({
        message: 'successfully updated the post',
        numberOfUpdatedPosts,
        updatedPost
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: 'Error while updating...'
      })
    })
});

// custom middleware

function validatePostId(req, res, next) {
    Posts.getById(req.params.id)
      .then(post => {
        if(post) {
          req.post = post
          next()
        } else {
          res.status(404).json({ message: 'Post not found, sry' })
        }
      })
      .catch(err => {
        console.log(error)
        res.status(500).json({
          message: 'Error retrieving the user'
        })
      })
}

function requiredProperty(property){
  return (req, res, next) => {
    if(!req.body[property]){
      res.status(400).json({
        message: `Needs to include a required ${property} property`
      })
    } else {
    next()
    }
  }
}


module.exports = router;
