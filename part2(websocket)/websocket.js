var startButton = document.getElementById("startButton");
var sendButton = document.getElementById("sendButton");
var closeButton = document.getElementById("closeButton");
var websocket;

startButton.disabled = false;
sendButton.disabled = true;
closeButton.disabled = true;

startButton.onclick = createWebSocketConnection;
sendButton.onclick = sendData;
closeButton.onclick = closeWebSocketConnection;

function log(text) {
    console.log("At time: " + (performance.now() / 1000).toFixed(3) + " --> " + text);
}

function createWebSocketConnection() {
    log("Creating WebSocket connection...");
    websocket = new WebSocket("ws://localhost:8080"); // Adjust the URL accordingly

    websocket.onopen = function() {
        log("WebSocket connection established.");
        startButton.disabled = true;
        sendButton.disabled = false;
        closeButton.disabled = false;
    };

    websocket.onmessage = function(event) {
        var receivedData = event.data;
        var receiveTextArea = document.getElementById("dataChannelReceive");
        receiveTextArea.value = receivedData;
    };
    

    websocket.onclose = function() {
        log("WebSocket connection closed.");
        startButton.disabled = false;
        sendButton.disabled = true;
        closeButton.disabled = true;
    };

    websocket.onerror = function(error) {
        log("WebSocket error: " + error);
    };
}

function sendData() {
    var data = document.getElementById("dataChannelSend").value;
    websocket.send(data); // Sending data via WebSocket
    log('Sent data: ' + data);
}

function closeWebSocketConnection() {
    log('Closing WebSocket connection');
    websocket.close();
    websocket = null;
    log('Closed WebSocket connection');
    startButton.disabled = false;
    sendButton.disabled = true;
    closeButton.disabled = true;
    document.getElementById("dataChannelSend").value = "";
}
