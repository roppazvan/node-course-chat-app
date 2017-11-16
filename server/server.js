const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/message');

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
        // to be able to send message but only for other users
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: formattedDateTime,
        // });
    });
});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`app started on port ${port}`);
});