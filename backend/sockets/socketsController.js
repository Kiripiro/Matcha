module.exports = (io) => {
    const users = {};

    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            const userId = Object.keys(users).find(key => users[key] === socket.id);
            console.log('disconnect', userId);
            if (userId) {
                console.log('user disconnected', userId);
                io.emit('user-disconnected', userId);
                delete users[userId];
                console.log(users);
            }
        });

        socket.on('init', (userId) => {
            users[userId] = socket.id;
            io.emit('user-connected', users[userId]);
            console.log('user connected', userId, users);
        });

        socket.on('new-message', (msg) => {
            console.log('new-message', msg);
            io.emit('new-message', msg);
            const recipientSocketId = users[msg.recipient_id];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('refresh', msg);
            }
        });

        socket.on('check-status', (usersIds) => {
            const userId = usersIds.senderId;
            const recipientId = usersIds.recipientId;
            const recipientSocketId = users[usersIds.recipientId];
            const senderSocketId = users[usersIds.senderId];
            if (recipientSocketId && userId) {
                io.to(senderSocketId).emit('status', { recipientId, status: 'online' });
            }
        });
    });
}