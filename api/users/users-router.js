const express = require('express');
// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model')
const Posts = require('../posts/posts-model')
// The middleware functions also need to be required
const {
    validateUserId,
    validateUser,
    validatePost,
} = require('../middleware/middleware')


const router = express.Router();

router.get('/', (req, res, next) => {
    Users.get()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
    Users.insert(req.body)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
    Users.update(req.params.id, req.body)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(next)
});

router.delete('/:id', validateUserId, (req, res, next) => {
    Users.remove(req.params.id)
        .then(() => {
            res.status(200).json(req.user)
        })
        .catch(next)
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
    // RETURN THE ARRAY OF USER POSTS
    // this needs a middleware to verify user id
    Posts.get()
        .then(posts => {
            const userPosts = posts.filter(p => p.user_id == req.params.id)
            res.status(200).json(userPosts)
        })
        .catch(next)
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
    // RETURN THE NEWLY CREATED USER POST
    // this needs a middleware to verify user id
    // and another middleware to check that the request body is valid
    Posts.insert(req.body)
        .then(post =>
            res.status(201).json(post)
        )
        .catch(next)
});

// do not forget to export the router
module.exports = router