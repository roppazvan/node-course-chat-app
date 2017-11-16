
var socket = io();

socket.on('connect', function() {
    console.log('connectedToServer');
});

socket.on('newMessage', function(message) {
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

socket.on('newChatMember', function(message) {
    console.log('newChatMember', message);
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function() {

    });
});
