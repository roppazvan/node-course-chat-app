const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const dateTime = require('node-datetime');
const dt = dateTime.create();
const formattedDateTime = dt.format('Y-m-d H:M:S');

io.on('connection', (socket) => {
    socket.emit('newMessage', {from: 'Admin', text: 'Welcome to the chat app'});
    socket.broadcast.emit('newMessage', {from: 'Admin', text: 'new member joined chat'});

    socket.on('createMessage', (message) => {
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createAt: formattedDateTime,
        });
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