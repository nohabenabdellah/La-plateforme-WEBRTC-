navigator.getUserMedia = navigator.getUserMedia  
|| navigator.webkitGetUserMedia 
|| navigator.mozGetUserMedia; 
var constraints = {audio: false, video: {
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 }
}}; 
var video = document.querySelector("video"); 
function successCallback(stream) { 
    window.stream = stream;
    if ("srcObject" in video) {
        video.srcObject = stream;
    } else {
        video.src = window.URL.createObjectURL(stream);
    }
    video.play();
} 
function errorCallback(error){ 
console.log("navigator.getUserMedia error: ", 
error);
} 
navigator.getUserMedia(constraints, successCallback, 
errorCallback);