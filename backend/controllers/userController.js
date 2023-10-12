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
            console.log("refresh");
            const refreshToken = this._parseCookie(req, 'refreshToken');
            if (!refreshToken) {
                res.status(401).json({ error: 'Refresh token missing' });
                return;
            }
            if (!InvalidTokensController.checkInvalidRefreshToken(refreshToken)) {
                return res.status(403).send("Invalid token blacklisted.");
            }
            const user = await this.model.findByToken(refreshToken);
            if (!user) {
                res.status(401).json('Invalid refreshToken');
                return;
            }
            console.log("refresh 2");

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
            // console.log(__dirname);
            // console.log("userData");
            // console.log(userData.files.length);
            const file = userData.files[0];
            file = file.replace("data:image/png;base64,", "")
            // console.log(file1);
            const imageBuffer = Buffer.from(file1, 'base64');
            var img = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=";
            // console.log(img);
            console.log(file2);
            fs.access('image.png', fs.constants.W_OK, (err) => {
                if (err) {
                  console.error(`Impossible d'écrire dans le fichier.`);
                } else {
                  console.log(`Écriture dans le fichier est autorisée.`);
                }
              });
            try {
                await decode(file2, {fname: "www", ext: "png"});
                console.log('Image enregistrée avec succès');
              } catch (error) {
                console.error('Erreur lors de l\'enregistrement de l\'image :', error);
              }
            // var data1 = img.replace(/^data:image\/\w+;base64,/, "");
            // var buf = Buffer.from(img, 'base64');
            // await fs.writeFileSync('/app/imagesSaved/imagee.png', buf, function (err) {
            //     console.log(err);
            //   })
            // try {
            //     fs.writeFileSync('/app/imagesSaved/d.png', imageBuffer);
            //     console.log('Image enregistrée avec succès');
            //   } catch (error) {
            //     console.error('Erreur lors de l\'enregistrement de l\'image :', error);
            //   }

            // console.log(userData);
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