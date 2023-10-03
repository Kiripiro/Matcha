const express = require('express');
const TagsController = require('../controllers/tagsController');
const router = express.Router();

// Example routes for userController - not used in the project yet

router.get('/user/:id', async (req, res) => {
    try {
        await TagsController.getAllByOwnerId(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        await TagsController.getTagById(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/create', async (req, res) => {
    try {
        await TagsController.createTag(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/delete', async (req, res) => {
    try {
        await TagsController.deleteTag(req, res);
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;