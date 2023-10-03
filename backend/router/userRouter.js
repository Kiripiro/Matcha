const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

// Example routes for userController - not used in the project yet
router.post('/register', async (req, res) => {
    try {
        await UserController.createUser(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/updateInfos', async (req, res) => {
    try {
        await UserController.updateInfos(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/delete', async (req, res) => {
    try {
        await UserController.deleteUser(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        await UserController.getById(req, res);
    } catch (error) {
        console.error(error);
    }
});

// app.get('/users', async (req, res) => {
//     try {
//         await UserController.getAllUsers(req, res);
//     } catch (error) {
//         console.error(error);
//     }
// });

module.exports = router;