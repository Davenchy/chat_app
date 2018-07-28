const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

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

    socket.emit('newMessage', {
        from: "Davenchy",
        text: "Hey maia",
        time: Date.now()
    });

    socket.on('createMessage', (data) => {
        console.log("Message:", data);
    });

    socket.on('disconnect', (socket) => {
        console.log('user was disconnected');
    });
});




server.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`);
});
