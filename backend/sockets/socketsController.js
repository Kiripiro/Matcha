module.exports = (io) => {
    const users = {};

    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
        console.log('users', users);

        socket.on('disconnect', () => {
            const userId = Object.keys(users).find(key => users[key].socketId === socket.id);
            console.log('disconnect', userId);
            if (userId) {
                console.log('user disconnected', userId);
                users[userId].status = 'Offline';
                io.emit('user-disconnected', userId);
                console.log(users);
            }
        });

        socket.on('init', (userId) => {
            users[userId] = { socketId: socket.id, status: 'Online' };
            io.emit('user-connected', userId);
            console.log('user connected', users);
        });

        socket.on('new-message', (msg) => {
            io.emit('new-message', msg);
            const recipientSocketId = users[msg.recipient_id].socketId;
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('refresh', msg);
            }
        });

        socket.on('check-status', (usersIds) => {
            const userId = usersIds.senderId;
            const recipientId = usersIds.recipientId;
            const recipientSocketId = users[usersIds.recipientId]?.socketId;
            const senderSocketId = users[usersIds.senderId]?.socketId;
            if (recipientSocketId && userId) {
                console.log('check-status', userId, recipientId, users[recipientId].status);
                io.to(senderSocketId).emit('status', users[recipientId].status);
            }
        });

        socket.on('user-status', ({ userId, status }) => {
            console.log('user-status', userId, status);
            if (!users[userId] || status) {
                return;
            }
            users[userId].status = status;
            io.emit('status', { userId, status });
        });
    });
}