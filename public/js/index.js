
var socket = io();

socket.on('connect', function() {
    console.log('connectedToServer');
    socket.emit('createMessage', {
       from: 'test',
       text: 'Hello',
    });
});

socket.on('newMessage', function(message) {
    console.log('newMessage', message);
});

socket.on('newChatMember', function(message) {
    console.log('newChatMember', message);
});

