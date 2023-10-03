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
            const user = await this.model.findByUsername(userData.username);
            const userIdReturn = await this.model.update(user.id, data);
            res.status(201).json({ message: 'User updated', userIdReturn });
        } catch (error) {
            console.log('error = ' + error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteUser(req, res) {
        try {
            const userData = req.body;
            const checkReturn = this._checkString(userData.username || '', 'Username', 25, /^[a-zA-Z0-9_-]+$/);
            if (checkReturn != true) {
                res.status(400).json({ error: checkReturn });
                return ;
            } else if (await this.model.findByUsername(userData.username) == null) {
                res.status(400).json({ error: "Username doesn't exist" });
                return ;
            }
            const user = await this.model.findByUsername(userData.username);
            const userIdReturn = await this.model.delete(user.id);
            res.status(201).json({ message: 'User deleted', userIdReturn });
        } catch (error) {
            console.log('error = ' + error);
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