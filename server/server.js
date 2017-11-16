const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');

const http = require('http');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    socket.emit('newMessage', generateMessage('Admin', 'Bine ai venit boss'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'A mai intrat unu pe chat'));

    socket.on('createMessage', (message, callback) => {
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('testcallback');
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });
});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`app started on port ${port}`);
});