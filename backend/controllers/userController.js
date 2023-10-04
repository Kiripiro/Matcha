const BaseController = require('./baseController');
const UserModel = require('../models/userModel');
const MessagesModel = require('../models/messagesModel');
const BlocksModel = require('../models/blocksModel');
const LikesModel = require('../models/likesModel');
const ReportsModel = require('../models/reportsModel');
const TagsModel = require('../models/tagsModel');
const ViewsModel = require('../models/viewsModel');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

class UserController extends BaseController {
    constructor() {
        super(UserModel);
    }

    async createUser(req, res) {
        try {
            const userData = req.body;
            const checkReturn = await this._checkSignUpInformations(
                userData.username || '',
                userData.email || '',
                userData.password || '',
                userData.first_name || '',
                userData.last_name || '',
                userData.age || 0);
            if (checkReturn != true) {
                res.status(400).json({ error: checkReturn });
                return;
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const data = {
                "username": userData.username,
                "email": userData.email,
                "password": hashedPassword,
                "first_name": userData.first_name,
                "last_name": userData.last_name,
                "age": userData.age,
                "email_checked": 0,
                "location_permission": 0
            };
            const userId = await this.model.create(data);
            res.cookie('token', this._generateToken(userId), { httpOnly: true, maxAge: 3600000 });
            res.status(201).json({ message: 'User created', userId });
        } catch (error) {
            console.log('error = ' + error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findByEmail(email);

            if (!user) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            const token = this._generateToken(user.id);

            const data = {
                "id": user.id,
                "username": user.username,
                "fist_name": user.first_name,
                "last_name": user.last_name,
                "age": user.age,
                "token": user.token,
                "email_checked": user.email_checked,
                "gender": user.gender,
                "sexual_preferences": user.sexual_preferences,
                "biography": user.biography,
                "picture_1": user.picture_1,
                "picture_2": user.picture_2,
                "picture_3": user.picture_3,
                "picture_4": user.picture_4,
                "picture_5": user.picture_5,
                "fame_rating": user.fame_rating,
                "location_permission": user.location_permission,
                "last_connection": user.last_connection,
                "created_at": user.created_at
            };

            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
            res.status(200).json({ message: 'Login successful', user: data });
        } catch (error) {
            console.log('error = ' + error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateInfos(req, res) {
        try {
            const userData = req.body;
            const userId = this._checkPositiveInteger(userData.id);
            if (userId < 0) {
                res.status(400).json({ error: 'User id is incorrect' });
                return;
            }
            const checkReturn = await this._checkCompleteSignUpInformations(
                userData.gender || '',
                userData.sexual_preferences || '',
                userData.biography || '',
                userData.picture_1 || '',
                userData.picture_2 || '',
                userData.picture_3 || '',
                userData.picture_4 || '',
                userData.picture_5 || '');
            if (checkReturn != true) {
                res.status(400).json({ error: checkReturn });
                return;
            }
            const data = {
                "gender": userData.gender,
                "sexual_preferences": userData.sexual_preferences,
                "biography": userData.biography,
                "picture_1": userData.picture_1,
                "picture_2": userData.picture_2,
                "picture_3": userData.picture_3,
                "picture_4": userData.picture_4,
                "picture_5": userData.picture_5
            };
            if (await this.checkById(userId)) {
                const userIdReturn = await this.model.update(userId, data);
                res.status(200).json({ message: 'User updated', userIdReturn });
            } else {
                res.status(400).json({ error: 'User id is incorrect' });
            }
        } catch (error) {
            console.log('error = ' + error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteUser(req, res) {
        try {
            const userData = req.body;
            const userId = this._checkPositiveInteger(userData.id || '');
            if (userId < 0) {
                res.status(400).json({ error: 'User id is incorrect' });
                return;
            }
            if (!await this.checkById(userId)) {
                res.status(400).json({ error: 'User id is incorrect' });
                return;

            }
            if (await MessagesModel.deleteUserMessages(userId) == null ||
                await BlocksModel.deleteUserBlocks(userId) == null ||
                await LikesModel.deleteUserLikes(userId) == null ||
                await ReportsModel.deleteUserReports(userId) == null ||
                await ViewsModel.deleteUserViews(userId) == null ||
                await TagsModel.deleteUserTags(userId) == null) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            const userIdReturn = await this.model.delete(userId);
            res.status(201).json({ message: 'User deleted', userIdReturn });
            return;

        } catch (error) {
            console.log('error = ' + error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getUserById(req, res) {
        try {
            const userId = this._checkPositiveInteger(req.params.id || '');
            if (userId < 0) {
                res.status(400).json({ error: 'User id is incorrect' });
                return;
            }
            const user = await this.model.findById(userId);
            if (!user) {
                res.status(404).json({ error: 'User not found' })
                return;
            } else {
                const userReturn = {
                    "username": user.username || '',
                    "first_name": user.first_name || '',
                    "last_name": user.last_name || '',
                    "age": user.age || '',
                    "gender": user.gender || '',
                    "sexual_preferences": user.sexual_preferences || '',
                    "biography": user.biography || '',
                    "picture_1": user.picture_1 || '',
                    "picture_2": user.picture_2 || '',
                    "picture_3": user.picture_3 || '',
                    "picture_4": user.picture_4 || '',
                    "picture_5": user.picture_5 || ''
                }
                res.json(userReturn);
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    _generateToken(userId) {
        const secretKey = process.env.JWT_SECRET;
        const expiresIn = '1h';

        const payload = {
            userId: userId,
            iat: Date.now()
        };

        const token = jwt.sign(payload, secretKey, { expiresIn });

        return token;
    }

    async _checkSignUpInformations(username, email, password, first_name, last_name, age) {
        var checkReturn = this._checkString(username, 'Username', 25, /^[a-zA-Z0-9_-]+$/);
        if (checkReturn != true) {
            return checkReturn;
        }
        checkReturn = this._checkString(email, 'Email', 50, /^[0-9a-zA-Z@._-]+$/);
        if (checkReturn != true) {
            return checkReturn;
        }
        checkReturn = this._checkString(password, 'Password', 25, /^[a-zA-Z0-9.$_-]+$/);
        if (checkReturn != true) {
            return checkReturn;
        }
        checkReturn = this._checkString(first_name, 'First name', 25, /^[a-zA-Z- ]+$/);
        if (checkReturn != true) {
            return checkReturn;
        }
        checkReturn = this._checkString(last_name, 'Last name', 25, /^[a-zA-Z- ]+$/);
        if (checkReturn != true) {
            return checkReturn;
        }
        age = this._checkPositiveInteger(age);
        if (age <= 0 || age > 150) {
            return 'Age is incorrect';
        }
        if (age < 18) {
            return 'Age is incorrect: you are too young';
        }
        if (await this.model.findByUsername(username) != null) {
            return 'Username already in use';
        }
        if (await this.model.findByEmail(email) != null) {
            return 'Email already in use';
        }
        return true;
    }

    async _checkCompleteSignUpInformations(gender, sexual_preferences, biography, picture_1, picture_2, picture_3, picture_4, picture_5) {
        var checkReturn = this._checkString(gender, 'Gender', 10, /^[0-9a-zA-Z+ ]+$/);
        if (checkReturn != true) {
            return checkReturn;
        }
        checkReturn = this._checkString(sexual_preferences, 'Sexual preferences', 10, /^[0-9a-zA-Z+ ]+$/);
        if (checkReturn != true) {
            return checkReturn;
        }
        checkReturn = this._checkString(biography, 'Biography', 400, /^[0-9a-zA-Z~`!@#$%^&*()+=_-{}[\]|:;"'><,.?/ ]+$/);
        if (checkReturn != true) {
            return checkReturn;
        }
        return true;
    }
}

module.exports = new UserController();