module.exports = (io) => {
    const users = {};

    io.on('connection', (socket) => {
        console.log('CONNECTION a user connected', socket.id);
        console.log('CONNECTION users', users);

        socket.on('userConnected', (userId) => { //"connect" is a reserved event name
            users[userId] = { socketId: socket.id, status: 'Online' };
            console.log("USERCONNECTED users = ", users)
            const status = 'Online';
            io.emit('all-users-status-events', { userId: userId, status: status }, {
                broadcast: true,
            });
        });

        socket.on('disconnect', () => {
            const userId = Object.keys(users).find(key => users[key].socketId === socket.id);
            console.log('DISCONNECT userId = ', userId);
            if (userId) {
                users[userId].status = 'Offline';
                io.emit('user-disconnected', userId); //voir si utile
                console.log(users);

                const status = 'Offline';
                io.emit('all-users-status-events', { userId: userId, status: status }, {
                    broadcast: true,
                });
            }
        });

        socket.on('init', (userId) => {
            users[userId] = { socketId: socket.id, status: 'Online' };
            const status = 'Online';
            io.emit('all-users-status-events', { userId, status }, {
                broadcast: true,
            });

            io.emit('user-connected', userId); //voir si utile
            console.log('INIT user connected', users);
        });

        socket.on('new-message', (msg) => {
            io.emit('new-message', msg);

            const recipientSocketId = users[msg.recipient_id]?.socketId;
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
                // io.to(senderSocketId).emit('status', users[recipientId].status);
                const status = users[recipientId].status;
                io.to(senderSocketId).emit('status', { userId: recipientId, status: status });
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

        socket.on('block-user', (data) => {
            const blockId = data.blockId;
            const author_id = data.author_id;
            const recipient_id = data.recipient_id;
            const recipientSocketId = users[recipient_id]?.socketId;

            if (author_id && recipientSocketId && blockId) {
                io.to(recipientSocketId).emit('user-blocked', { blockId: blockId, author_id: author_id, recipient_id: recipient_id });
            }
        });

        socket.on('unblock-user', (data) => {
            console.log('unblock', data);
            const blockId = data.blockId;
            const author_id = data.author_id;
            const recipient_id = data.recipient_id;
            const recipientSocketId = users[recipient_id]?.socketId;

            if (author_id && recipientSocketId && blockId) {
                io.to(recipientSocketId).emit('user-unblocked', { blockId: blockId, author_id: author_id, recipient_id: recipient_id });
            }
        })
    });
}