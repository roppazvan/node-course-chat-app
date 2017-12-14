const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

const http = require('http');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const { Users } = require('./utils/users');
const users = new Users();

io.on('connection', (socket) => {

    socket.on('join', (params, callback) => {
        const { name, room } = params;
        if(!isRealString(name) || !isRealString(room)) {
            callback('Name and room name are required');
            return;
        }
        socket.join(room);

        // add user to list and notify rooms to update userList
        users.removeUser(socket.id);
        users.addUser(socket.id, name, room);
        io.to(room).emit('updateUserList', users.getUserList(room));

        // emit a message for the user with welcome, after that emit a message to all users
        socket.emit('newMessage', generateMessage('Admin', `Bine ai venit ${name} pe chat-ul ${room}. Nu spama te rog`));
        socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `A mai intrat ${name} pe camera ${room}`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        const user = users.getUser(socket.id);
        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
            callback('testcallback');
        }
    });

    socket.on('createLocationMessage', (coords) => {
        const user = users.getUser(socket.id);
        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`) );
        }
    });
});

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`app started on port ${port}`);
});