
var socket = io();
var notificationSound = false;

window.addEventListener('focus', function() {
    jQuery(document).prop('title', 'Chat app');
    notificationSound = false;
});

window.addEventListener('blur', function() {
    notificationSound = true;
});

// when new message is added scroll
function scrollToBottom() {
    // selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

// JOIN A CHAT ROOM
socket.on('connect', function() {
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function(err) {
        if (err) {
            window.location.href = '/';
            alert(err);
        } else {
            console.log('noErr');
        }
    });
});

// LISTEN FOR NEW EVENTS ON SERVER AND DISPLAY THEM
// text messages
socket.on('newMessage', function(message) {
    var template = jQuery('#message-template').html();
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime,
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    var params = jQuery.deparam(window.location.search);
    if(message.from !== params.name && notificationSound) {
        jQuery(document).prop('title', 'new message..');
        var audio = jQuery('#nelson')[0];
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }
});

// location messages
socket.on('newLocationMessage', function(message) {
    console.log(message);
    var template = jQuery('#location-message-template').html();
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime,
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newImage', function(image) {
    var template = jQuery('#image-message-template').html();
    var formattedTime = moment(image.createdAt).format('h:mm a');
    var html = Mustache.render(template, {
        from: image.from,
        createdAt: formattedTime,
        image: image.image,
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});


// new user joined - update user list
socket.on('updateUserList', function(users) {
    var ol = jQuery('<ol></ol>');
    users.forEach(function(user) {
        ol.append(jQuery('<li></li>').html('<img class="profile-pic" src="/favicon/nelson.png" />' + user));
    });
    jQuery('#users').html(ol);
});

// EMIT EVENTS TO THE SERVER
// send message
jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    var messageTextBox = jQuery('[name=message]');
    socket.emit('createMessage', {
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

//send photo
jQuery('#upload-image-btn').on('click', function() {
    jQuery('#fileInput').click();
});

jQuery('#fileInput').on('change', function(e) {
    var file = e.target.files[0];
    console.log('file', file);
    var reader = new FileReader();
    reader.onload = function (ev) {
        socket.emit('newImage', ev.target.result);
    }
    reader.readAsDataURL(file);
});