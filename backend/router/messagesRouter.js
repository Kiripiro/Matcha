const express = require('express');
const MessagesController = require('../controllers/messagesController');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/author/:id', async (req, res) => {
    try {
        await MessagesController.getAllByAuthorId(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/recipient/:id', async (req, res) => {
    try {
        await MessagesController.getAllByRecipientId(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        await MessagesController.getMessageById(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:authorId/:recipientId', async (req, res) => {
    try {
        await MessagesController.getConversation(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/create', async (req, res) => {
    try {
        await MessagesController.createMessage(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/delete', async (req, res) => {
    try {
        await MessagesController.deleteMessage(req, res);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;