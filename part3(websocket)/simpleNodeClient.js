const ws = new WebSocket('ws://localhost:8181');

ws.onopen = function open() {
    const channel = prompt("Enter signaling channel name:");

    if (channel !== "") {
        console.log('Trying to create or join channel: ', channel);
        const data = JSON.stringify({ type: 'create_or_join', channel });
        ws.send(data);
    }
};

ws.onmessage = function incoming(event) {
    const data = JSON.parse(event.data);
    const { type, channel, payload } = data;
    const messagesDiv = document.getElementById('scratchPad');

    switch (type) {
        case 'created':
            messagesDiv.innerHTML += '<p>Channel ' + channel + ' has been created!</p>';
            messagesDiv.innerHTML += '<p>This peer is the initiator...</p>';
            break;
        case 'joined':
            messagesDiv.innerHTML += '<p>Message from server: ' + payload + '</p>';
            break;
        case 'remote_peer_joining':
            messagesDiv.innerHTML += '<p>Request to join ' + channel + '</p>';
            messagesDiv.innerHTML += '<p>You are the initiator!</p>';
            break;
        case 'message':
            messagesDiv.innerHTML += '<p>Got message from other peer: ' + payload + '</p>';
            break;
        case 'Bye':
            messagesDiv.innerHTML += '<p>Got "Bye" from other peer! Going to disconnect...</p>';
            ws.terminate();
            break;
        case 'full':
            messagesDiv.innerHTML += '<p>Channel ' + channel + ' is too crowded! Cannot allow you to enter, sorry :-(</p>';
            break;
    }
};

ws.onclose = function () {
    console.log('Connection closed');
};