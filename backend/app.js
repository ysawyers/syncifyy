// .env for database info; token secret / admin secret; token algo
require('dotenv').config();

// Using Node & Express on the backend
const express = require('express');
const app = express();

const config = require('./config');

// cors & volleyball package
const volleyball = require('volleyball');
const cors = require('cors');

// bringing in auth endpoints
const auth = require('./routes/auth/auth');
const adminUsers = require('./routes/api/admin/adminUsers');
const adminLobbies = require('./routes/api/admin/adminLobbies');

// bringing in the main endpoints for the web app
const lobbies = require('./routes/api/lobbies');
const mainLobby = require('./routes/api/lobby');

// custom middlewares
const middlewares = require('./middlewares/middleware');

/*
=====
1. Accepting AJAX requests from the client using CORS
2. Parsing the body of the request using built-in express method
3. Logging type of AJAX request
=====
*/

app.use(cors());
app.use(express.json());
app.use(volleyball);

// when a request comes in it will hit one of these endpoints
app.use('/auth', auth);
app.use('/admin', middlewares.isAdmin, adminUsers);
app.use('/admin', middlewares.isAdmin, adminLobbies);
app.use('/lobbies', middlewares.isAuthorized, lobbies);
app.use('/lobby', middlewares.isAuthorized, mainLobby);

// if none of the endpoints got hit, the request was invalid; hence not found
app.use('*', (req, res) => {
  const error = new Error('API endpoint not found!');
  res.status(404);
  res.json({
    error: error.message,
  });
  res.end();
});

const server = app.listen(config.port, () => {
  if (config.environment !== 'production') {
    console.log(`Running on port ${config.port}: DEV`);
  } else {
    console.log(`Running on port ${config.port}: PROD`);
  }
});

// bringing in socket.io package; listening to requests that hit the url the server is running on
const io = require('socket.io')(server);

// when a client connects to the server it will initialize a connection with socket.io
io.on('connection', (socket) => {
  /*
  =====
  currentLobbyId param is used to make sure that
  requests are only being sent to the right lobby
  =====
  */

  // when the client presses play on the controller it will send a request to the server and distribute the event across all clients
  socket.on('playing', (currentLobbyId) => {
    io.emit('play', currentLobbyId); // emits play event to all clients (that are connected to the lobby that the user sent it from)
  });
  // when the client clicks on the progress bar seeking to a new time in the video...
  socket.on('seek-to', (data) => {
    // data consists of currentLobbyId & the timestamp the client skipped to
    let currentLobbyId = data.currentLobbyId;
    let newPositionInTimeline = data.newPositionInTimeline;
    io.emit('seeking', { newPositionInTimeline, currentLobbyId }); // emit the data to all clients (that are connected to the lobby that the user sent it from)
  });
  // when the client inserts a new URL...
  socket.on('new-video', (currentLobbyId) => {
    io.emit('reload', currentLobbyId); // reload the page (frontend makes a request to store the new URL in the database)
  });
  // when the client clicks pause on the controller it will emit event to all clients
  socket.on('paused', (currentLobbyId) => {
    io.emit('pause', currentLobbyId); // emits event to all clients (that are connected to the lobby that the user sent it from)
  });

  socket.on('chat-message', (data) => {
    io.emit('message', data);
  });

  socket.on('new-connection', (data) => {
    socket.id = data.username;
    socket.join(`${data.lobbyId}`);
    let lobby = io.sockets.adapter.rooms[`${data.lobbyId}`];
    io.emit('watcher-join', lobby);
  });

  socket.on('lost-connection', (data) => {
    io.emit('watcher-leave', data);
  });
});
