var socket = io();
var name = 'User';

// log on connected with server
socket.on('connect', function () {
    console.log("connected to server");
});

// log on disconnected with server
socket.on('disconnect', function () {
    console.log("disconnected from server");
});


socket.on('newMessage', function (message) {
    createMessage(message.from, message.text);
});

// on document ready
$(document).ready(function () {
    name = prompt("What is your name?", "User");

    $("#title").text($("#title").text() + " - " + name);
    socket.emit("newuser", {name});

    // on messages form submit new message
    $('form').on('submit', function (e) {
        // prevent page refresh
        e.preventDefault();
        // get the message
        var text = $('[name=message]').val();
        // clear the text input
        $('[name=message]').val('');
        // emit the message to the server
        socket.emit('createMessage', {text});
        // print message to the screen
        createMessage('me', text);
    });

});

// print message to screen
function createMessage(from, text) {
    // create new p element
    var msg = $('<p></p>');
    // change inner text
    msg.text(`${from}: ${text}`);
    // append to the document
    $('#messages').append(msg);
}


// send current user location
function sendlocation(e) {
    // check if the browser support the geolocation future
    if (!navigator.geolocation) return alert("Your browser is not supported!");

    // create p element to print status
    var status = $('<p id="status"></p>');
    status.text("Collecting geo location data...");

    // append to the document
    $('#messages').append(status);

    // get the location and send it as a message
    navigator.geolocation.getCurrentPosition(function (p) {

        status.text("Sending data....");

        // create text
        var text = `Geo Location: ${p.coords.latitude}, ${p.coords.longitude}`;
        // print the text to the screen
        createMessage(name, text);
        // emit the message to the server
        socket.emit('createMessage', {text})
    }, function () {
        // if can not get the location data
        status.text('Unable to get your location');
    });

}
