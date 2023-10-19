module.exports = (io) => {
    const users = {};

    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('disconnect', () => {
            console.log('User disconnected');
            const userId = Object.keys(users).find(key => users[key] === socket.id);
            if (userId) {
                delete users[userId];
            }
        });

        socket.on('init', (userId) => {
            users[userId] = socket.id;
            console.log('users = ' + users[userId]);
        });

        socket.on('new-message', (msg) => {
            io.emit('new-message', msg);
            const recipientSocketId = users[msg.recipient_id];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('refresh', msg);
            }
        }
        );
    });
}