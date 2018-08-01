const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
const moment = require('moment');

const publicPath = path.join(__dirname, '../public');
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


io.on('connection', (socket) => {
    console.log('user was connected');

    socket.on('newuser', function (data) {
        socket.name = data.name;

        socket.emit("newMessage", {
            from: "Server",
            text: `Welcome ${socket.name} to our chat room!`,
            time: Date.now()
        });

        socket.broadcast.emit("newMessage", {
            from: "Server",
            text: `${socket.name} was joined!`,
            time: getTime()
        });
    });


    socket.on('createMessage', function (data, next) {
        console.log("Send Message");
        socket.broadcast.emit('newMessage', {
           from: socket.name,
           text: data.text,
           time: getTime()
        });
        next(getTime());
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('newMessage', {
            from: "Server",
            text: `${socket.name} leaved the room!`,
            time: getTime()
        })
    })

});

function getTime() { return moment().valueOf(); }



server.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`);
});
