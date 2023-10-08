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
const { v4: uuidv4 } = require('uuid')

class UserController extends BaseController {
    constructor() {
        super(UserModel);
    }

    async createUser(req, res) {
        try {
            const userData = req.body;
            if (await this.model.findByUsername(userData.username) != null) {
                res.status(400).json({ error: 'Username already in use' });
                return;
            }
            if (await this.model.findByEmail(userData.email) != null) {
                res.status(400).json({ error: 'Email already in use' });
                return;
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const refreshToken = uuidv4();
            const data = {
                "username": userData.username,
                "email": userData.email,
                "password": hashedPassword,
                "first_name": userData.first_name,
                "last_name": userData.last_name,
                "age": userData.age,
                "email_checked": 0,
                "location_permission": 0,
                "token": refreshToken,
                "token_creation": this._getTimestampString(),
                "token_expiration": this._getTimestampString(1)
            };
            const userId = await this.model.create(data);
            res.cookie('accessToken', this._generateToken(userId), { httpOnly: true, maxAge: 900000 });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 86400000 });
            res.status(201).json({ message: 'User created', userId });
        } catch (error) {
            console.log('error = ' + error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Don't forget to implement send email verification
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

            const accessToken = this._generateToken(user.id);

            const data = {
                "id": user.id,
                "username": user.username,
                "fist_name": user.first_name,
                "last_name": user.last_name,
                "age": user.age,
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

            res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
            res.cookie('refreshToken', user.token, { httpOnly: true, maxAge: 86400000 });
            res.status(200).json({ message: 'Login successful', user: data });
        } catch (error) {
            console.log('error = ' + error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async refreshToken(req, res) {
        try {
            const refreshToken = this._parseCookie(req, 'refreshToken');
            if (!refreshToken) {
                res.status(401).json({ error: 'Refresh token missing' });
                return;
            }
            const user = await this.model.findByToken(refreshToken);
            if (!user) {
                res.status(401).json({ error: 'Invalid refresh token' });
                return;
            }

            const tokenExpiration = new Date(user.token_expiration);
            const now = new Date();
            if (tokenExpiration < now) {
                res.status(401).json({ error: 'Refresh token expired' });
                return;
            }

            const accessToken = this._generateToken(user.id);
            res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 900000 });
            res.status(200).json({ message: 'Access token refreshed' });
        } catch (error) {
            console.log('error = ' + error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateInfos(req, res) {
        try {
            const userId = req.user.userId;
            // const userId = this._checkPositiveInteger(req.body.id);
            const userData = req.body;
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
            const user = await this.model.findById(req.params.id);
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
        const expiresInMinutes = Number(process.env.JWT_EXPIRES_IN);

        if (!secretKey || !expiresInMinutes) {
            throw new Error('JWT configuration error');
        }

        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimeInSeconds = currentTimeInSeconds + expiresInMinutes * 60;

        const payload = {
            userId: userId,
            iat: currentTimeInSeconds,
            exp: expirationTimeInSeconds
        };

        const token = jwt.sign(payload, secretKey);

        return token;
    }

    _parseCookie(req, toFind) {
        const cookies = req.headers.cookie;
        if (cookies) {
            const cookieArray = cookies.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
                const cookie = cookieArray[i].split('=');
                if (cookie[0].trim() === toFind) {
                    return cookie[1];
                }
            }
        }
        return null;
    }
}

module.exports = new UserController();