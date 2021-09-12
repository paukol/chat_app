const express = require('express');
const path = require('path');
const socket = require('socket.io');
const app = express();

let messages = [];
let users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req,res) => {
  return res.status(404).json({
    message: 'Not found...'
  });
});

const server = app.listen(8000, () => {
  console.log('Server is running on port 8000: http://localhost:8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('login', (user) => {
    users.push(user);
    socket.broadcast.emit('newUser', {author: 'Chat Boy', content: '' + user.name + ' has joined the conversation!'});
  });
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => {
    const name = (users.filter(user => user.id === socket.id))[0].name;
    users = users.filter(user => user.id !== socket.id);
    socket.broadcast.emit('userHasLeft', {author: 'Chat Boy', content: '' + name + ' has left the conversation... :('} )
  });
  console.log('I\'ve added a listener on message and disconnect events \n');
});