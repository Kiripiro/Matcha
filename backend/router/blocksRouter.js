const express = require('express');
const BlocksController = require('../controllers/blocksController');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/user/:id', auth, async (req, res) => {
    try {
        await BlocksController.getAllByAuthorId(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        await BlocksController.getBlockById(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:authorId/:recipientId', auth, async (req, res) => {
    try {
        await BlocksController.getCheckBlock(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/create', auth, async (req, res) => {
    try {
        await BlocksController.createBlock(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        await BlocksController.deleteBlock(req, res);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;