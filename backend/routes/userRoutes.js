const express = require('express');
const UserController = require('../../controllers/userController');
const router = express.Router();

// Example routes for userController - not used in the project yet
router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.get('/profile/:userId', UserController.getUserProfile);

router.put('/profile/:userId', UserController.updateUserProfile);

router.delete('/profile/:userId', UserController.deleteUser);

module.exports = router;