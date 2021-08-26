// Using Node & Express
const express = require('express');
const router = express.Router();

// helper functions for various http status code errors (400's..500s)
const helper = require('../../helpers/errorFunctions');

// Lobby model for lobbies collection in database
const Lobbies = require('../../database/Models/LobbiesModel');

const validate = require('validate.js');

const constraints = {
  title: {
    presence: true,
    length: {
      maximum: 30,
      tooLong: `must be less than 30 characters long!`,
    },
  },
};

// POST /lobbies/create-lobby
router.post('/create-lobby', async (req, res) => {
  const owner = req.user.username; // current user creating lobby (owner)
  const title = req.body.lobbyName; // lobby title
  const password = req.body.lobbyPassword; // lobby password
  const private = req.body.isPrivate; // lobby private (bool)

  const validationError = validate({ title }, constraints);

  if (validationError) {
    helper.httpError400(res, validationError.title[0]);
  } else {
    const lobby = await Lobbies.findOne({ where: { title } }); // query database for a lobby with the same name
    if (!lobby) {
      if (private) {
        const newLobby = await Lobbies.create({
          owner,
          title,
          password,
          private,
        });
        res.status(200);
      } else {
        const newLobby = await Lobbies.create({
          owner,
          title,
        });
        res.status(200);
      }
      res.end();
    } else {
      // lobby with the same name was found
      helper.httpError409(res, 'Lobby already exists!'); // send according error message back to client
    }
  }
});

// GET /lobbies/open-lobbies
router.get('/open-lobbies', async (req, res) => {
  const lobbies = await Lobbies.findAll(); // query database for all lobbies
  res.status(200); // return status code 200 OK
  res.json(lobbies); // send all the lobbies in the database to the client
});

// GET /lobbies/check-connections
router.get('/check-connections/:lobbyId', async (req, res) => {
  const lobbyId = req.params.lobbyId;
  const lobby = await Lobbies.findOne({
    where: {
      uuid: lobbyId,
    },
  });
  res.status(200);
  res.json(lobby.connections);
});

// GET /lobbies/user
router.get('/user', (req, res) => {
  res.status(200);
  res.json(req.user.username);
});

module.exports = router;
