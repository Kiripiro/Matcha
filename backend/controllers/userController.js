const BaseController = require('./baseController');
const UserModel = require('../models/userModel');

class UserController extends BaseController {
    constructor() {
        super(UserModel);
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.model.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await this.model.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async createUser(req, res) {
        try {
            const userData = req.body;
            const userId = await this.model.create(userData);
            res.status(201).json({ message: 'User created', userId });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Add more controller methods here like update, delete...
}

module.exports = new UserController();