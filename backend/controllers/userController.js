const BaseController = require('./baseController');
const UserModel = require('../models/userModel');

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
                return ;
            }
            const data = {
                "username": userData.username,
                "email": userData.email,
                "password": userData.password,
                "first_name": userData.first_name,
                "last_name": userData.last_name,
                "age": userData.age,
                "email_checked": 0,
                "location_permission": 0
            };
            const userId = await this.model.create(data);
            res.status(201).json({ message: 'User created', userId });
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
                return ;
            }
            const checkReturn = await this._checkCompleteSignUpInformations(
                userData.username || '',
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
                return ;
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
                res.status(201).json({ message: 'User updated', userIdReturn });
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
                return ;
            }
            if (await this.checkById(userId)) {
                const userIdReturn = await this.model.delete(userId);
                res.status(201).json({ message: 'User deleted', userIdReturn });
                return ;
            } else {
                res.status(400).json({ error: 'User id is incorrect' });
                return ;
            }
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
                return ;
            }
            const user = await this.model.findById(userId);
            if (!user) {
                res.status(404).json({ error: 'User not found' })
                return ;
            } else {
                const userReturn = {
                    "username": user.username || '',
                    "first_name": user.first_name || '',
                    "last_name": user.last_name || '',
                    "age": user.age || '',
                    "gender": user.gender || '',
                    "sexual_preferences": user.sexual_preferences || '',
                    "biography":  user.biography || '',
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

    async _checkCompleteSignUpInformations(username, gender, sexual_preferences, biography, picture_1, picture_2, picture_3, picture_4, picture_5) {
        var checkReturn = this._checkString(username, 'Username', 25, /^[a-zA-Z0-9_-]+$/);
        if (checkReturn != true) {
            return checkReturn;
        }
        checkReturn = this._checkString(gender, 'Gender', 10, /^[0-9a-zA-Z+ ]+$/);
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
        if (await this.model.findByUsername(username) == null) {
            return "Username doesn't exist";
        }
        return true;
    }

    // Add more controller methods here like update, delete...
}

module.exports = new UserController();