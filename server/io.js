const http = require('http');
const {Server} = require('socket.io');
let io;

//This function will probably redone to be somehow more generalized we will see
const handleItemToRoom =(socket,item) => {
   socket.rooms.forEach(room => {
      console.log('roomCHANGE');
      if(room === socket.id) return;
      io.to(room).emit('newItemInbound', item);
   })
}

const handleRoomChange = (socket, roomName) => {
    socket.rooms.forEach(room => {
        if(room === socket.id) return; 
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

        socket.on('newItemInbound', (item) => handleItemToRoom(socket, item));
        socket.on('room change', (room) => handleRoomChange(socket, room));
    });

    return server;
};

module.exports = socketSetup;