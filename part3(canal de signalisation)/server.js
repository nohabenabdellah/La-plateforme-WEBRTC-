const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = socketIO(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"] 
  }
});

io.sockets.on('connection', function (socket) {
    socket.on('message', function (message) {
        log('S --> Got message: ', message);
        socket.broadcast.to(message.channel).emit('message', message.message);
    });
    socket.on('create or join', function (channel) {
        var numClients = io.sockets.adapter.rooms[channel] ? io.sockets.adapter.rooms[channel].length : 0;
        console.log('numclients = ' + numClients);
        if (numClients == 0) {
            socket.join(channel);
            socket.emit('created', channel);
        } else if (numClients == 1) {
            io.sockets.in(channel).emit('remotePeerJoining', channel);
            socket.join(channel);
            socket.broadcast.to(channel).emit('broadcast:joined', 'S --> broadcast(): client ' + socket.id + ' joined channel ' + channel);
        } else {
            console.log("Channel full!");
            socket.emit('full', channel);
        }
    });
    socket.on('response', function (response) {
        log('S --> Got response: ', response);
        socket.broadcast.to(response.channel).emit('response', response.message);
    });
    socket.on('Bye', function (channel) {
        socket.broadcast.to(channel).emit('Bye');
        socket.disconnect();
    });
    socket.on('Ack', function () {
        console.log('Got an Ack!');
        socket.disconnect();
    });
});

// Define log function outside of the event handler
function log() {
    var array = [">>> "];
    for (var i = 0; i < arguments.length; i++) {
        array.push(arguments[i]);
    }
    socket.emit('log', array);
}

const PORT = process.env.PORT || 8181;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});