const express = require('express');
const ViewsController = require('../controllers/viewsController');
const router = express.Router();

router.get('/author/:id', async (req, res) => {
    try {
        await ViewsController.getAllByAuthorId(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/recipient/:id', async (req, res) => {
    try {
        await ViewsController.getAllByRecipientId(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        await ViewsController.getViewById(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:authorId/:recipientId', async (req, res) => {
    try {
        await ViewsController.getCheckView(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/create', async (req, res) => {
    try {
        await ViewsController.createView(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/delete', async (req, res) => {
    try {
        await ViewsController.deleteView(req, res);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;