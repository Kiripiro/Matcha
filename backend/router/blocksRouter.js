const express = require('express');
const BlocksController = require('../controllers/blocksController');
const router = express.Router();

router.get('/user/:id', async (req, res) => {
    try {
        await BlocksController.getAllByAuthorId(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        await BlocksController.getBlockById(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:authorId/:recipientId', async (req, res) => {
    try {
        await BlocksController.getCheckBlock(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/create', async (req, res) => {
    try {
        await BlocksController.createBlock(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/delete', async (req, res) => {
    try {
        await BlocksController.deleteBlock(req, res);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;