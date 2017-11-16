
var socket = io();
socket.on('connect', function() {
    console.log('connectedToServer');
    socket.emit('createMessage', {
       to: 'All',
       text: 'Hello',
    });
});

socket.on('disconnect', function() {
    console.log('disconnected from server');
});

socket.on('newMessage', function(message) {
    console.log('newEmail', message);
});
