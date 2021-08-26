// bringing in jsonwebtoken package to verify user tokens
const jwt = require('jsonwebtoken');

// helper functions for various http status code errors (400's..500s)
const helper = require('../helpers/errorFunctions');

// function is used to make sure that whenever a user accesses
// one of the endpoints they are valid
function isAuthorized(req, res, next) {
  if (!req.headers.authorization) {
    // if there is no token
    helper.httpError400(res, 'Please proceed to login!'); // send according error message back to client
    res.end();
  } else {
    // there was a token
    jwt.verify(
      // verify token against token secret
      req.headers.authorization,
      process.env.TOKEN_SECRET,
      (err, data) => {
        if (err) {
          // if token wasn't valid
          helper.httpError500(res, err); // send according error message back to client
        } else {
          // attach user data to the request
          req.user = data; // assign data to request
          next(); // keep going....
        }
      }
    );
  }
}

// function is used to make sure that client that
// is accessing admin endpoints is the admin
function isAdmin(req, res, next) {
  if (req.headers.authorization == process.env.ADMIN_TOKEN) {
    // if the token is equal to admin token the client is an admin
    next(); // keep going...
  } else {
    helper.httpError400(res, 'Please proceed to login!'); // send according error message back to client
    res.end(); // end request
  }
}

module.exports = {
  isAuthorized,
  isAdmin,
};
