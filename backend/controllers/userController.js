const BaseController = require('./baseController');
const InvalidTokensController = require('./invalidTokenController');
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
const fs = require('fs');
const Jimp = require("jimp");
const decode = require('node-base64-image').decode;

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
            const returnData = {
                "id": userId,
                "username": userData.username,
                "email": userData.email,
                "first_name": userData.first_name,
                "last_name": userData.last_name,
                "age": userData.age,
                "location_permission": 0
            };
            res.status(201).json({ message: 'User created', user: returnData });
        } catch (error) {
            console.log('error = ' + error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Don't forget to implement send email verification
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await UserModel.findByUsername(username);

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
            const refreshToken = uuidv4();
            const dataToUpdate = {
                "token": refreshToken,
                "token_creation": this._getTimestampString(),
                "token_expiration": this._getTimestampString(1)
            };
            const userIdReturn = await this.model.update(user.id, dataToUpdate);

            const data = {
                "id": user.id,
                "username": user.username,
                "fist_name": user.first_name,
                "last_name": user.last_name,
                "age": user.age,
                "email_checked": user.email_checked,
                "complete_register": user.complete_register,
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
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 86400000 });
            res.status(200).json({ message: 'Login successful', user: data });
        } catch (error) {
            console.log('error = ' + error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async logout(req, res) {
        try {
            const accessToken = this._parseCookie(req, 'accessToken');
            if (!accessToken) {
                res.status(401).json({ error: 'Access token missing' });
                return;
            }
            const refreshToken = this._parseCookie(req, 'refreshToken');
            if (!refreshToken) {
                res.status(401).json({ error: 'Refresh token missing' });
                return;
            }
            const invalidToken = await InvalidTokensController.addInvalidToken(accessToken, refreshToken);
            if (invalidToken) {
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                res.status(200).json({ message: 'Logout successful' });
            } else {
                console.log('error = ' + error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } catch (error) {
            console.log('error = ' + error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async refreshToken(req, res) {
        try {
            const refreshToken = this._parseCookie(req, 'refreshToken');
            if (!refreshToken) {
                res.status(401).json({ error: 'Missing refreshToken' });
                return;
            }
            if (!InvalidTokensController.checkInvalidRefreshToken(refreshToken)) {
                return res.status(403).send({ error: 'Invalid token blacklisted' });
            }
            const user = await this.model.findByToken(refreshToken);
            if (!user) {
                res.status(403).send({ error: 'Invalid refreshToken' });
                return;
            }

            const tokenExpiration = new Date(user.token_expiration);
            const now = new Date();
            if (tokenExpiration < now) {
                res.status(401).json({ error: 'refreshToken expired' });
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
            const userData = req.body;
            var pictures = await this._savePictures(userData.files, userId);
            if (pictures == null) {
                res.status(400).json({ error: 'Invalid pictures files' });
                return;
            }
            if (pictures.length <= 0) {
                res.status(400).json({ error: 'Picture missing' });
                return;
            }
            const data = {
                "complete_register": true,
                "gender": userData.gender,
                "sexual_preferences": userData.sexual_preferences,
                "biography": userData.biography,
                "picture_1": pictures[0],
                "picture_2": pictures[1],
                "picture_3": pictures[2],
                "picture_4": pictures[3],
                "picture_5": pictures[4]
            };
            if (await this.checkById(userId)) {
                const userIdReturn = await this.model.update(userId, data);
                res.status(200).json({ message: 'User updated', user: data });
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
            this._removePicture("picture_1_" + userId);
            this._removePicture("picture_2_" + userId);
            this._removePicture("picture_3_" + userId);
            this._removePicture("picture_4_" + userId);
            this._removePicture("picture_5_" + userId);
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
                    "picture_1": await this._getPictureDataFromPath(user.picture_1),
                    "picture_2": await this._getPictureDataFromPath(user.picture_2),
                    "picture_3": await this._getPictureDataFromPath(user.picture_3),
                    "picture_4": await this._getPictureDataFromPath(user.picture_4),
                    "picture_5": await this._getPictureDataFromPath(user.picture_5)
                }
                res.json(userReturn);
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getUserByUsername(req, res) {
        try {
            console.log("getUserByUsername");
            const user = await this.model.findByUsername(req.body.username);
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
                    "complete_register": user.complete_register || false,
                    "biography": user.biography || '',
                    "picture_1": await this._getPictureDataFromPath(user.picture_1),
                    "picture_2": await this._getPictureDataFromPath(user.picture_2),
                    "picture_3": await this._getPictureDataFromPath(user.picture_3),
                    "picture_4": await this._getPictureDataFromPath(user.picture_4),
                    "picture_5": await this._getPictureDataFromPath(user.picture_5)
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

    async _savePictures(files, userId) {
        var picturesPath = [];
        const maxFiles = (files.length < 5) ? files.length : 5;
        for (var i = 0; i < 5; i++) {
            if (i < files.length) {
                var file = files[i];
                var type = "";
                if (file.substring(0, 22) == 'data:image/png;base64,') {
                    file = file.replace("data:image/png;base64,", "");
                    type = "png";
                } else if (file.substring(0, 23) == 'data:image/jpeg;base64,') {
                    file = file.replace("data:image/jpeg;base64,", "");
                    type = "jpeg";
                } else if (file.substring(0, 22) == 'data:image/jpg;base64,') {
                    file = file.replace("data:image/jpg;base64,", "");
                    type = "jpg";
                } else {
                    return null;
                }
                const path = "/app/imagesSaved/picture_" + (i + 1) + "_" + userId;
                try {
                    decode(file, { fname: path, ext: type });
                    if (type != "png") {
                        fs.unlink(path + ".png", (error) => {
                            if (error) {
                                console.error('Unlink error :', error);
                                return null;
                            } else {
                                console.log(path + ".png" + ' removed');
                                return true;
                            }
                        });
                    }
                    if (type != "jpeg") {
                        fs.unlink(path + ".jpeg", (error) => {
                            if (error) {
                                console.error('Unlink error :', error);
                                return null;
                            } else {
                                console.log(path + ".jpeg" + ' removed');
                                return true;
                            }
                        });
                    }
                    if (type != "jpg") {
                        fs.unlink(path + ".jpg", (error) => {
                            if (error) {
                                console.error('Unlink error :', error);
                                return null;
                            } else {
                                console.log(path + ".jpg" + ' removed');
                                return true;
                            }
                        });
                    }
                } catch (error) {
                    console.error('Decode error :', error);
                    return null;
                }
                picturesPath.push((path + "." + type));
            } else {
                this._removePicture("picture_" + (i + 1) + "_" + userId);
            }
        }
        return picturesPath;
    }

    async _removePicture(filename) {
        fs.readdir("/app/imagesSaved/", (error, files) => {
            if (error) {
                console.error('Readdir error :', error);
                return null;
            }
            const fileToRemove = files.find((file) =>
                file.startsWith(filename)
            );
            console.log("filetoremove = " + fileToRemove);
            if (fileToRemove && fileToRemove.length > 0) {
                const pathToRemove = "/app/imagesSaved/" + fileToRemove;
                fs.unlink(pathToRemove, (error) => {
                    if (error) {
                        console.error('Unlink error :', error);
                        return null;
                    } else {
                        console.log(pathToRemove + ' removed');
                        return true;
                    }
                });
            }
        });
    }

    async _getPictureDataFromPath(path) {
        if (!path || path.length <= 0) {
            return "";
        }
        return new Promise((resolve, reject) => {
            fs.readFile(path, (error, data) => {
                if (error) {
                    console.error(error);
                    reject(error);
                } else {
                    const imageString = data.toString('base64');
                    resolve(imageString);
                }
            });
        });
    }
}

module.exports = new UserController();