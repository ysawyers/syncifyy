// Using Node & Express
const express = require('express');
const router = express.Router();

// Lobbies model for lobbies collection in database
const Lobbies = require('../../../database/Models/LobbiesModel');

// GET /admin/list-lobbies
router.get('/list-lobbies', async (req, res) => {
  const lobbies = await Lobbies.findAll(); // query database for all lobbies
  res.status(200); // return status code 200 OK
  res.json(lobbies); // send all lobbies to the client (admin)
});

// PUT /admin/change-lobby
router.put('/change-lobby', async (req, res) => {
  const lobbyId = req.body.lobbyId; // ID of lobby being changed
  const title = req.body.lobbyName; // new lobby name
  const private = req.body.isPrivate; // still private? (bool)
  const password = req.body.lobbyPassword; // new password

  const lobby = await Lobbies.findOne({ where: { uuid: lobbyId } }); // query database for the lobby title that is being updated
  const updated = await Lobbies.update(
    // query and update document with new lobby information
    { title, private, password },
    { where: { uuid: lobbyId } }
  );
  res.status(200); // return status code 200 OK
  res.json(`Successfully edited ${lobby.title}!`); // send success message to client
});

// DELETE /admin/delete-lobby
router.delete('/delete-lobby', async (req, res) => {
  const lobbyId = req.body.lobbyId; // ID of lobby being deleted

  const lobby = await Lobbies.findOne({ where: { uuid: lobbyId } }); // query database for the lobby title that is being deleted
  const deleted = await Lobbies.destroy({ where: { uuid: lobbyId } }); // delete the document in the database
  res.status(200); // return status 200 OK
  res.json(`Successfully deleted ${lobby.title}`); // send success message to client
});

module.exports = router;
