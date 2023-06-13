const socket = io();


    // Enviar mensajes al servidor de socket
    const sendMessage = (message) => {
        socket.emit('chatMessage', message);
    };

    return {
        sendMessage,
    };