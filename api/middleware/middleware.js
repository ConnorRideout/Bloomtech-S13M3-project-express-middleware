const User = require('../users/users-model')

// logs to the console the following information about each request: request method, request url, and a timestamp
// -> this middleware runs on every request made to the API
function logger(req, res, next) {
    const { method, originalUrl } = req
    const time = new Date()
    console.log(
        `REQUEST METHOD: ${method}
        REQUEST URL: ${originalUrl}
        TIMESTAMP: ${time.toLocaleString()}`
    )
    next()
}

// if the id parameter is valid, store the user object as req.user and allow the request to continue.
// if the id parameter does not match any user id in the database, respond with status 404 and { message: "user not found" }
// -> this middleware will be used for all user endpoints that include an id parameter in the url
async function validateUserId(req, res, next) {
    try {
        const { id } = req.params
        const user = await User.getById(id)
        if (user) {
            req.user = user
            next()
        } else {
            next({ status: 404, message: "user not found" })
        }
    } catch (err) {
        next(err)
    }
}

// if the request body lacks the required name field, respond with status 400 and { message: "missing required name field" }
// -> validates the body on a request to create or update a user
function validateUser(req, res, next) {
    if (
        req.body &&
        Object.keys(req.body).length > 0 &&
        req.body.name &&
        req.body.name.trim()
    ) {
        next()
    } else {
        next({ status: 400, message: "missing required name field" })
    }
}

// if the request body lacks the required text field, respond with status 400 and { message: "missing required text field" }
// -> validates the body on a request to create a new post
function validatePost(req, res, next) {
    if (
        req.body &&
        Object.keys(req.body).length > 0 &&
        req.body.text &&
        req.body.text.trim()
    ) {
        req.body.user_id = req.params.id
        next()
    } else {
        next({ status: 400, message: "missing required text field" })
    }
}


function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
    res.status(err.status || 500).json({ message: err.message })
}

// do not forget to expose these functions to other modules
module.exports = {
    logger,
    validateUserId,
    validateUser,
    validatePost,
    errorHandler,
}