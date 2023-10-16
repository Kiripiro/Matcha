const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();
const auth = require('../middleware/auth');
const user = require('../middleware/user');

router.post('/register', user.createUserValidation, async (req, res) => {
    try {
        await UserController.createUser(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/login', user.loginValidation, async (req, res) => {
    try {
        await UserController.login(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/logout', auth, user.logoutValidation, async (req, res) => {
    try {
        await UserController.logout(req, res);
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

router.post('/updateInfos', auth, user.updateInfosValidation, async (req, res) => {
    try {
        await UserController.updateInfos(req, res);
    } catch (error) {
        console.error(error);
    }
});

router.post('/username', auth, user.getUserByUsernameValidation, async (req, res) => {
    try {
        console.log("post")
        await UserController.getUserByUsername(req, res);
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

router.get('/:id', auth, user.getUserByIdValidation, async (req, res) => {
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