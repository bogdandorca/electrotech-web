$(document).ready(function() {
    let connectionOptions =  {
        "force new connection" : true,
        "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
        "timeout" : 10000, //before connect_error and connect_timeout are emitted.
        "transports" : ["websocket"]
    };

    let socket = io('https://node-chat-y.herokuapp.com/', connectionOptions);

    let users = [];

    socket.on('connect', function() {
        socket.emit('request-init', '', function(data) {
            if (!data || !data.username) return;
            $('#user-info').html(data.username);
            if (data.messages) {
                data.messages.forEach(message => {
                    addMessage(message);
                });
            }
        });
    });

    socket.on('update-messages', function(data) {
        addMessage(data);
    });

    socket.on('user-connected', function(user) {
        let index = users.indexOf(user);
        if (index >= 0) user.splice(index, 1);
    });

    socket.on('user-disconnected', function(user) {

    });

    let inputBox = $('#chat-input');

    $('#chat-submit').click(function() {
        let message = inputBox.val();
        sendMessage(message);
    });

    function sendMessage(message) {
        if (messageIsValid(message)) emitMessage(message);
    }

    function messageIsValid(message) {
        return message && message.length > 0;
    }

    function emitMessage(message) {
        socket.emit('message', message, function(data) {
            if (!data) {
                alert('There has been an error');
                return;
            }
            inputBox.val('');
        });
    }

    function addMessage(message) {
        $('#chat-window').append(getMessageFormat(message));
    }

    function getMessageFormat(message) {
        return `<div class="message">
                <p><span class="username">${message.client}:</span> ${message.message}</p>
            </div>`;
    }
});