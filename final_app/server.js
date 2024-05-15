const static = require('node-static');
const http = require('http');
const socketIO = require('socket.io');

const file = new static.Server('./public');
const app = http.createServer((req, res) => {
    file.serve(req, res);
}).listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

const io = socketIO(app);

io.on('connection', socket => {
    console.log('A user connected');

    socket.on('join', room => {
        socket.join(room);
        socket.to(room).emit('message', {
            type: 'join',
            id: socket.id
        });
    });

    socket.on('message', message => {
        socket.broadcast.to('testRoom').emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
