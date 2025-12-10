const http = require('http');
const { Server } = require('socket.io');

let io;

const handleRoomChange = (socket, roomName) => {
  socket.rooms.forEach((room) => {
    if (room === socket.id) return;
    socket.leave(room);
  });
  socket.join(roomName);
};

const socketSetup = (app) => {
  const server = http.createServer(app);
  io = new Server(server);

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.join('inventory1');

    socket.on('disconnect', () => {
      console.log('a user disconnected');
    });

    socket.on('room change', (room) => handleRoomChange(socket, room));
  });

  return server;
};

module.exports = socketSetup;
