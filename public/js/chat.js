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

    // on messages form submit new message
    $('form').on('submit', function (e) {
        console.log('hello');
        // prevent page refresh
        e.preventDefault();
        // get the message
        var msg = $('[name=message]').val();
        // clear the text input
        $('[name=message]').val('');
        // emit the message to the server
        socket.emit('createMessage', {
            from: name,
            text: msg
        });
        // print message to the screen
        createMessage('me', msg);
    });

});


function createMessage(from, text) {
    var msg = $('<p></p>');
    msg.text(`${from}: ${text}`);
    $('#messages').append(msg);
}


function sendlocation(e) {
    if (!navigator.geolocation) return alert("Your browser is not supported!");

    alert("please wait...");

    navigator.geolocation.getCurrentPosition(function (position) {
        alert(position);
        createMessage(name, `Geo Location: ${position.latitude}, ${position.longitude}`);
    }, function () {
        alert('Unable to get your location');
    });

}
