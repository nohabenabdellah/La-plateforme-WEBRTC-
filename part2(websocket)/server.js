const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Stockage des connexions des clients
const clients = new Set();

wss.on('connection', function connection(ws) {
    console.log('Client connected');
    
    // Ajouter la connexion du client à l'ensemble des clients
    clients.add(ws);

    ws.on('message', function incoming(message) {
        console.log('Received: %s', message);

        // Transmettre le message à tous les autres clients
        clients.forEach(function(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', function() {
        console.log('Client disconnected');
        
        // Supprimer la connexion du client de l'ensemble des clients
        clients.delete(ws);
    });
});
