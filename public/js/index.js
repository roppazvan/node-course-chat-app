
var socket = io();

socket.on('connect', function() {
    console.log('connectedToServer');
});

// display new messages from server
socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var titleDiv = jQuery('<div></div>');
    var h4 = jQuery('<h4></h4>');
    var span = jQuery('<span></span>');
    var p = jQuery('<p></p>');
    span.text(formattedTime);
    h4.text(message.from);
    titleDiv.addClass('message__title');
    titleDiv.append(h4);
    titleDiv.append(span);
    li.addClass('message');
    li.append(titleDiv);
    var messageDiv = jQuery('<div></div>');
    messageDiv.addClass('message__body');
    p.text(message.text);
    messageDiv.append(p);
    li.append(messageDiv);
    jQuery('#messages').append(li);
    jQuery('#messages').animate({
        scrollTop: $(document).height()
    }, 'slow');
});

// display location messages
socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var titleDiv = jQuery('<div></div>');
    var h4 = jQuery('<h4></h4>');
    var span = jQuery('<span></span>');
    var a = jQuery('<a target="_blank">My current location</a>');
    span.text(formattedTime);
    h4.text(message.from);
    titleDiv.addClass('message__title');
    titleDiv.append(h4);
    titleDiv.append(span);
    li.addClass('message');
    li.append(titleDiv);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
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