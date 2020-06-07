const express = require('express');
const Server = require('socket.io')
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js')

// specifies which port it listens to
const PORT = process.env.PORT || 5000

// create server
const app = express();
const httpServer = http.createServer(app);
const io = Server(httpServer)

console.log("My server is now running. Hi.")

// just some code to return a message if you visit the url
app.get('/', (req, res) => {
  res.send('<h1>The server is online. Check.</h1>');
});

// When a new client connects to our server, we establish bi-directional communication
io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('New socket has conneceted')

  // Joining a room?
  socket.on('join', ({ name, room }, callback) => {

    const { error, user } = addUser({ id: socket.id, name, room});
    console.log(`Just added user with socket id: ${socket.id}`)

    if (error) return callback(error)

    socket.emit('message', { user: 'admin', text: `Hi ${user.name}, welcome to ther room ${user.room}`})
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!`})

    socket.join(user.room)

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})

    callback();
  })

  socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id)

      console.log(socket.id)

      io.to(user.room).emit('message', { user: user.name, text: message})
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)})

      callback()
  })

  socket.on('pingServer', (data) => {
    
    console.log(data)

})

  socket.on('disconnect', () => {
      const user = removeUser(socket.id)

      if(user){
          io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.`})
      }
  })


}

// Ensures server is listening for connections
httpServer.listen(PORT, () => console.log(`Server has started on port ${PORT}`));