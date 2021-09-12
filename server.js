const express = require("express");
const path = require("path");
const socket = require('socket.io');
const messages = [];
const app = express();
app.use(express.static(path.join(__dirname, "/client")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/index.html"));
});

app.use((req, res) => {
  res.status(404).send("404 not found...");
});
const server = app.listen(8000, () => {
  console.log("Server is running on port: 8000");
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => { console.log('Oh, user ' + socket.id + ' has left :(')});
  console.log('I\'ve added a listener on message and disconnect events \n');
}); 