
var socket = io();

socket.on('connect', function() {
    console.log('connectedToServer');
});

// display new messages from server with mustache js
socket.on('newMessage', function(message) {
    var template = jQuery('#message-template').html();
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime,
    });
    jQuery('#messages').append(html);
});

// display location messages
socket.on('newLocationMessage', function(message) {
    var template = jQuery('#location-message-template').html();
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var html = Mustache.render(template, {
        location: message.url,
        from: message.from,
        createdAt: formattedTime,
    });
    jQuery('#messages').append(html);
});

// emit messages on form submit
jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    var messageTextBox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function() {
        messageTextBox.val('');
    });
});


//send location
var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }
    locationButton.removeAttr('disabled', 'disabled').text('Sending location..');
    locationButton.attr('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.removeAttr('disabled', 'disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function() {
        locationButton.removeAttr('disabled', 'disabled').text('Send Location');
        alert('Unable to fetch location!');
    });
});