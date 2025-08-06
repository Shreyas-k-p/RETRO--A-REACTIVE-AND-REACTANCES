const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let players = {};
let bestReaction = { time: null, player: null };
let startTimestamp = null;
let roundTimeout = null;
let isGreen = false;

io.on('connection', (socket) => {
  if (Object.keys(players).length >= 4) {
    socket.emit('roomFull');
    return;
  }

  players[socket.id] = { score: 0, name: `Player ${Object.keys(players).length + 1}` };
  io.emit('playersUpdate', players, bestReaction);

  if (Object.keys(players).length >= 2) {
    setTimeout(startRound, 2000);
  }

  socket.on('click', () => {
    if (!isGreen) {
      io.to(socket.id).emit('failClick');
      return;
    }

    const reactionTime = Date.now() - startTimestamp;
    players[socket.id].score++;

    // Update high score
    if (!bestReaction.time || reactionTime < bestReaction.time) {
      bestReaction = {
        time: reactionTime,
        player: players[socket.id].name
      };
    }

    io.emit('successClick', {
      winner: players[socket.id].name,
      time: reactionTime,
      players,
      bestReaction
    });

    isGreen = false;
    clearTimeout(roundTimeout);

    setTimeout(startRound, 3000);
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('playersUpdate', players, bestReaction);
    if (Object.keys(players).length < 2) isGreen = false;
  });
});

function startRound() {
  io.emit('prepare');
  const delay = Math.floor(Math.random() * 4000) + 2000;

  roundTimeout = setTimeout(() => {
    isGreen = true;
    startTimestamp = Date.now();
    io.emit('go');
  }, delay);
}

http.listen(3000, () => {
  console.log("Game running on http://localhost:3000");
});
