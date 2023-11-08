module.exports = (io) => {
    const users = {};

    io.on('connection', (socket) => {

        socket.on('userConnected', (userId) => {
            users[userId] = { socketId: socket.id, status: 'Online' };
            const status = 'Online';
            io.emit('all-users-status-events', { userId: userId, status: status }, {
                broadcast: true,
            });
        });

        socket.on('disconnect', () => {
            const userId = Object.keys(users).find(key => users[key].socketId === socket.id);
            if (userId) {
                users[userId].status = 'Offline';
                io.emit('user-disconnected', userId); //voir si utile

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
        });

        socket.on('new-message', (msg) => {
            io.emit('new-message', msg);
            const recipientSocketId = users[msg.recipient_id]?.socketId;
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('refresh', msg);
            }
            const notification = {
                author_id: msg.author_id,
                type: 'message',
                message: `You have received a new message from`,
            };
            io.to(recipientSocketId).emit('new-notification', notification);
        });

        socket.on('check-status', (usersIds) => {
            const userId = usersIds.senderId;
            const recipientId = usersIds.recipientId;
            const recipientSocketId = users[usersIds.recipientId]?.socketId;
            const senderSocketId = users[usersIds.senderId]?.socketId;
            if (recipientSocketId && userId) {
                const status = users[recipientId].status;
                io.to(senderSocketId).emit('status', { userId: recipientId, status: status });
            }
        });

        socket.on('user-status', ({ userId, status }) => {
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
            const blockId = data.blockId;
            const author_id = data.author_id;
            const recipient_id = data.recipient_id;
            const recipientSocketId = users[recipient_id]?.socketId;

            if (author_id && recipientSocketId && blockId) {
                io.to(recipientSocketId).emit('user-unblocked', { blockId: blockId, author_id: author_id, recipient_id: recipient_id });
            }
        })

        socket.on('new-like', (data) => {
            const recipientSocketId = users[data.recipient_id]?.socketId;
            const notification = {
                author_id: data.author_id,
                type: 'like',
                message: `You have received a new like from`,
            };
            io.to(recipientSocketId).emit('new-notification', notification);
        });

        socket.on('delete-like', (data) => {
            const recipientSocketId = users[data.recipient_id]?.socketId;
            const notification = {
                author_id: data.author_id,
                type: 'unlike',
                message: `You have received a new unlike from`,
            };
            io.to(recipientSocketId).emit('new-notification', notification);
        });

        socket.on('new-match', (data) => {
            const recipientSocketId = users[data.recipient_id]?.socketId;
            const notificationRecipient = {
                author_id: data.author_id,
                type: 'match',
                message: `You have matched with`,
            };

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('new-notification', notificationRecipient);
            }
        });

        socket.on('new-view', (data) => {
            const recipientSocketId = users[data.recipient_id]?.socketId;
            const notification = {
                author_id: data.author_id,
                type: 'visit',
                message: `You have received a new visit from`,
            };
            io.to(recipientSocketId).emit('new-notification', notification);
        });
    });
}