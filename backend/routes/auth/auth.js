// Using Node & Express
const express = require('express');
const router = express.Router();

/*
=====
1. validate.js package is used to make sure user input is correct before querying the database
2. jsonwebtoken (JWT) package is used to assign a token with a payload with user data
3. bcrypt package is used to hash password before inserting in the database
=====
*/

const validate = require('validate.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// helper functions for various http status code errors (400's..500s)
const helper = require('../../helpers/errorFunctions');

// Users Model for users collection in database
const Users = require('../../database/Models/UsersModel');

// validate.js constraints (on registration)
const constraints = {
  username: {
    presence: true,
    length: {
      maximum: 20,
      tooLong: `must be less than 20 characters long!`,
    },
  },
  password: {
    presence: true,
    length: {
      maximum: 30, // must have at least 6 characters
      tooLong: 'must be less than 30 characters long!',
    },
  },
};

// POST /auth/register
router.post('/register', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const validationError = validate({ username, password }, constraints); // run user input against constraints
  if (validationError) {
    // if it failed to pass the constraints
    if (validationError.username) {
      // if the username was incorrect
      helper.httpError400(res, validationError.username[0]); // send according error message back to client
    } else {
      // if the password was incorrect
      helper.httpError400(res, validationError.password[0]); // send according error message back to client
    }
  } else {
    // passed validation
    const user = await Users.findOne({
      // query database to check if user has already been created
      where: {
        username,
      },
    });

    if (!user) {
      // if it hasn't already been created
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        // hash password
        const newUser = await Users.create({ username, password: hash }); // insert in db
        res.status(200); // return with status code 200 OK
        res.end(); // end
      });
    } else {
      // already in database
      helper.httpError409(res, 'Username already created!'); // send according error message back to client
    }
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const validationError = validate({ username, password }, constraints); // validate user input
  if (validationError) {
    // if not valid...
    helper.httpError400(res, 'Username / Password is invalid.'); // send according error message back to client
  } else {
    const user = await Users.findOne({
      // query database for username
      where: {
        username,
      },
    });
    if (user) {
      // if the username was found
      bcrypt.compare(password, user.password, (err, result) => {
        // compare hashed password in db to the plaintext password the user has inputted
        if (result) {
          // if it was correct
          jwt.sign(
            // sign a payload with token for user
            { id: user.id, username, lobby: user.lobby }, // payload data (user_id, username, current lobby)
            process.env.TOKEN_SECRET,
            (err, token) => {
              if (err) {
                // if there was an error for some reason
                helper.httpError500(res, 'Server is unstable ATM'); // server error
              } else {
                // everything went well
                res.status(200); // return with status code 200 OK
                res.json({
                  // send token to client
                  token,
                });
              }
            }
          );
        } else {
          // password was incorrect (didn't match with the hashed password)
          helper.httpError400(res, 'Username / Password is invalid.');
        }
      });
    } else {
      // no user with that username
      helper.httpError400(res, 'Username / Password is invalid.');
    }
  }
});

module.exports = router;
