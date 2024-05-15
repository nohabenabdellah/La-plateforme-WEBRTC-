const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());

const wss = new WebSocket.Server({ server });

const sockets = {};

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        handleMessage(ws, message);
    });

    ws.on('close', function close() {
        console.log('Client disconnected');

        Object.keys(sockets).forEach(channel => {
            if (sockets[channel] === ws) {
                delete sockets[channel];
            }
        });
    });
});

function handleMessage(ws, message) {
    const data = JSON.parse(message);
    const { type, channel, payload } = data;

    switch (type) {
        case 'create_or_join':
            handleCreateOrJoin(ws, channel);
            break;
        case 'message':
            handleMessageBroadcast(ws, channel, payload);
            break;
        case 'response':
            handleResponseBroadcast(ws, channel, payload);
            break;
        case 'Bye':
            handleBye(ws, channel);
            break;
        case 'Ack':
            handleAck(ws);
            break;
        default:
            console.log('Unknown message type:', type);
    }
}

function handleCreateOrJoin(ws, channel) {
    const numClients = Object.keys(sockets[channel] || {}).length;
    console.log('numclients = ' + numClients);
    if (numClients === 0) {
        sockets[channel] = ws;
        ws.send(JSON.stringify({ type: 'created', channel }));
    } else if (numClients === 1) {

        Object.values(sockets[channel]).forEach(peer => {
            peer.send(JSON.stringify({ type: 'remote_peer_joining', channel }));
        });
        sockets[channel] = ws;
        ws.send(JSON.stringify({ type: 'joined', channel }));
    } else {
        console.log("Channel full!");
        ws.send(JSON.stringify({ type: 'full', channel }));
    }
}

function handleMessageBroadcast(ws, channel, message) {
    Object.values(sockets[channel] || {}).forEach(client => {
        if (client !== ws) {
            client.send(JSON.stringify({ type: 'message', message }));
        }
    });
}

function handleResponseBroadcast(ws, channel, response) {
    Object.values(sockets[channel] || {}).forEach(client => {
        if (client !== ws) {
            client.send(JSON.stringify({ type: 'response', message: response }));
        }
    });
}

function handleBye(ws, channel) {
    Object.values(sockets[channel] || {}).forEach(client => {
        if (client !== ws) {
            client.send(JSON.stringify({ type: 'Bye' }));
        }
    });
    ws.terminate();
}

function handleAck(ws) {
    ws.terminate();
}

const PORT = process.env.PORT || 8181;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});