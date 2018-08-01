var socket = io();
var name = 'User';
var middleware = new Middleware();

// log on connected with server
socket.on('connect', function () {
    console.log("connected to server");
});

// log on disconnected with server
socket.on('disconnect', function () {
    console.log("disconnected from server");
});


socket.on('newMessage', function (message) {
    var msg = createMessage(message.from, message.text, true);
    msg.setTime(message.time);
    msg.stopLoading();
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

        // middleware [under development]
        // if (middleware.isCommand(text)) middleware.parseeval(text);
        // else {
            // print message to the screen
            var msg = createMessage('Me', text, true);
            // emit the message to the server and stop loading effect
            socket.emit('createMessage', {text}, function (time) { msg.setTime(time); msg.stopLoading(); });
        // }

    });

    $('#Location_btn').on('click', sendlocation);

});

// print message to screen
function createMessage(from, text, isLoading=false) {
    // create element
    var msg = $('<div></div>');
    // add message class
    msg.addClass('message');
    // add template
    msg.html(`
        <div class="message__title"><h4>${from}</h4><span class="time"></span></div>
        <div class="message__body"><p>${text}</p></div>
    `);

    // add loading effect
    if (isLoading) {
        // add the class
        msg.addClass('loading');
        // method to stop loading effect
        msg.stopLoading = function () { this.removeClass('loading'); }
    }

    // set time
    msg.setTime = function (time) {
        this.children('.message__title').children('.time').text(`${moment(time).format('h:mm a')}`);
    }

    // append to the document
    $('#messages').append(msg);

    return msg;
}


// send current user location
function sendlocation(e) {
    // check if the browser support the geolocation future
    if (!navigator.geolocation) return alert("Your browser is not supported!");

    // disable the button
    var btn = $('#Location_btn');

    btn.attr('disabled', '');

    // create p element to print status
    var status = $('<p id="status"></p>');
    status.text("Collecting geo location data...");

    // append to the document
    $('#messages').append(status);

    // get the location and send it as a message
    navigator.geolocation.getCurrentPosition(function (p) {

        status.text("Sending data....");

        // create anchor href
        var url = `https://www.google.com/maps?q=${p.coords.latitude},${p.coords.longitude}`;

        // create text
        var text = `<a href="${url}" target="_blank">GeoLocation [Google Maps]</a>`;
        // print the text to the screen
        createMessage(name, text);
        // emit the message to the server
        socket.emit('createMessage', {text}, function () {
            btn.removeAttr('disabled');
        });
    }, function () {
        // if can not get the location data
        status.text('Unable to get your location');
        btn.removeAttr('disabled');
    });

}







print = function (...text) {
    var str = "";

    for(var i = 0; i < text.length; i++) {
        var c = text[i], n = text[++i];
        str += c;
        if (n) str += ' ';
    }

    var e = $('<p></p>');
    e.html(str);
    $('#messages').append(e);

    return {
        help: function () {
            print('print(HTML) : print HTML to screen');
        }
    }

}


help = function (pkg) {
    if (pkg) return window[pkg].help();

    Object.keys(window).forEach(k => {
        console.log(k);
        console.log(Object.keys(window[k]));

    })

}
