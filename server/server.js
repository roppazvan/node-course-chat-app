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
    console.log('user was connected');
    socket.on('disconnect', () => {
        console.log('disconnected from server');
    });
    socket.emit('newMessage', {
        from: 'Razvan',
        text: 'Hey boss',
        createdAt: formattedDateTime,
    });
    socket.on('createMessage', (message) => {
        console.log(message);
    });
});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`app started on port ${port}`);
});