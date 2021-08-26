// Using Node & Express
const express = require('express');
const router = express.Router();

/*
=====
1. validate.js package is used to make sure user input is correct before querying the database
2. bcrypt package is used to hash password before inserting in the database
=====
*/

const validate = require('validate.js');
const bcrypt = require('bcrypt');

// helper functions for various http status code errors (400's..500s)
const helper = require('../../../helpers/errorFunctions');

// Users model for users collection in database
const User = require('../../../database/Models/UsersModel');

// validate.js constraints (change password)
const constraints = {
  password: {
    presence: true,
    length: {
      minimum: 6,
      message: 'must be at least 6 characters!',
    },
  },
};

// GET /admin/list-users
router.get('/list-users', async (req, res) => {
  const allUsers = await User.findAll(); // query database for all users
  res.status(200); // return status code 200 OK
  res.json(allUsers); // send all users to the client (admin)
});

// PUT / admin/change-password
router.put('/change-password', (req, res) => {
  const userId = req.body.userId; // ID of user having password changed
  const newPassword = req.body.newPassword; // the new password
  const validationError = validate({ password: newPassword }, constraints); // put password through validation

  if (validationError) {
    // if it failed validation...
    helper.httpError400(res, validationError.password[0]);
  } else {
    // if it passed validation
    const saltRounds = 12;
    bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
      // hash the new password
      if (err) {
        // if there was an error for some reason
        helper.httpError400(res, 'Issue hashing password!'); // send according error message back to client
      } else {
        // everything was good
        await User.update(
          { password: hash },
          {
            where: {
              id: userId,
            },
          }
        ); // query database and insert new password in the document
        res.status(200); // return status code 200 OK
        res.json('Successfully changed password!'); // send success message to client
      }
    });
  }
});

// DELETE /admin/remove-user
router.delete('/remove-user', async (req, res) => {
  const userId = req.body.userId; // ID of user being deleted

  const user = await User.findOne({
    where: {
      id: userId,
    },
  }); // query database for username
  await User.destroy({
    where: {
      id: userId,
    },
  }); // delete user in the database
  res.status(200); // return status code 200 OK
  res.json(`Successfully deleted ${user.username}`); // send success message to client
});

module.exports = router;
