const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
    try {
        await UserController.createUser(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        await UserController.login(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/refreshToken', async (req, res) => {
    try {
        await UserController.refreshToken(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/updateInfos', auth, async (req, res) => {
    try {
        await UserController.updateInfos(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/delete', auth, async (req, res) => {
    try {
        await UserController.deleteUser(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        await UserController.getUserById(req, res);
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