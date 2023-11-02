const express = require('express');
const LikesController = require('../controllers/likesController');
const router = express.Router();
const auth = require('../middleware/auth');
const like = require('../middleware/like');

router.get('/author/:id', async (req, res) => {
    try {
        await LikesController.getAllByAuthorId(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/recipient/:id', auth, like.getAllByRecipientId, async (req, res) => {
    try {
        await LikesController.getAllByRecipientId(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        await LikesController.getLikeById(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/create', auth, like.createLike, async (req, res) => {
    try {
        await LikesController.createLike(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/delete', auth, like.deleteLike, async (req, res) => {
    try {
        await LikesController.deleteLike(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/matches/:id', auth, async (req, res) => {
    try {
        await LikesController.getMatches(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/check/:authorId/:recipientId', auth, like.getCheckLike, async (req, res) => {
    try {
        await LikesController.getCheckLike(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/checkMatch/:authorId/:recipientId', auth, like.getCheckMatch, async (req, res) => {
    try {
        await LikesController.getCheckMatch(req, res);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;