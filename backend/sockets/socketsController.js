module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    io.on('connection', (socket) => {
        socket.on('new-message', (msg) => {
            io.emit('new-message', msg);
            console.log('message: ' + msg.content, msg.author_id, msg.recipient_id);
            // store the message in the database

        });
    });
}