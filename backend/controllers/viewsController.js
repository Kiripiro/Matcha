const BaseController = require('./baseController');
const ViewsModel = require('../models/viewsModel');
const UserController = require('../controllers/userController');
const BlocksController = require('../controllers/blocksController');

class ViewsController extends BaseController {
    constructor() {
        super(ViewsModel);
    }

    async getAllByAuthorId(req, res) {
        try {
            const authorId = this._checkPositiveInteger(req.params.id || '');
            if (authorId < 0) {
                res.status(400).json({ error: "Author id is incorrect" });
                return ;
            }
            const views = await this.model.findMultiple(["author_id"], [authorId])
            if (!views) {
                res.status(404).json({ error: 'View not found' })
                return ;
            } else {
                var viewsReturn = [];
                views.find((row) => row).forEach(element => {
                    viewsReturn.push(element);
                });
                res.json(viewsReturn);
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAllByRecipientId(req, res) {
        try {
            const recipientId = this._checkPositiveInteger(req.params.id || '');
            if (recipientId < 0) {
                res.status(400).json({ error: "Recipient id is incorrect" });
                return ;
            }
            const views = await this.model.findMultiple(["recipient_id"], [recipientId])
            if (!views) {
                res.status(404).json({ error: 'View not found' })
                return ;
            } else {
                var viewsReturn = [];
                views.find((row) => row).forEach(element => {
                    viewsReturn.push(element);
                });
                res.json(viewsReturn);
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getViewById(req, res) {
        try {
            const viewId = this._checkPositiveInteger(req.params.id || '');
            if (viewId < 0) {
                res.status(400).json({ error: 'View id is incorrect' });
                return ;
            }
            const view = await this.model.findById(viewId);
            if (!view) {
                res.status(404).json({ error: 'View not found' })
                return ;
            } else {
                res.json(view);
            }
            return ;
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getCheckView(req, res) {
        try {
            const authorId = this._checkPositiveInteger(req.params.authorId || '');
            if (authorId < 0) {
                res.status(400).json({ error: 'Author id is incorrect' });
                return ;
            }
            const recipientId = this._checkPositiveInteger(req.params.recipientId || '');
            if (recipientId < 0) {
                res.status(400).json({ error: 'Recipient id is incorrect' });
                return ;
            }
            if (await this.model.check([authorId, recipientId])) {
                res.status(200).json({ exist: true });
                return ;
            } else {
                res.status(200).json({ exist: false });
                return ;
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async createView(req, res) {
        try {
            const viewData = req.body;
            const authorId = this._checkPositiveInteger(viewData.author_id || '');
            if (authorId < 0) {
                res.status(400).json({ error: "Author id is incorrect" });
                return ;
            }
            const recipientId = this._checkPositiveInteger(viewData.recipient_id || '');
            if (recipientId < 0) {
                res.status(400).json({ error: "Recipient id is incorrect" });
                return ;
            }
            if (authorId == recipientId) {
                res.status(400).json({ error: "Author id  and recipient id is equal" });
                return ;
            }
            if (!await UserController.checkById(authorId)) {
                res.status(400).json({ error: "Author id doesn't exists" });
                return ;
            }
            if (!await UserController.checkById(recipientId)) {
                res.status(400).json({ error: "Recipient id doesn't exists" });
                return ;
            }
            const checkBlock = await BlocksController._checkBlock(authorId, recipientId);
            if (checkBlock == true) {
                res.status(400).json({ error: "Relationship is blocked" });
                return ;
            } else if (checkBlock != false) {
                console.log('error = ' + checkBlock);
                res.status(500).json({ error: 'Internal Server Error' });
                return ;
            }
            if (await this.model.check([authorId, recipientId])) {
                res.status(400).json({ error: "View already exists" });
                return ;
            }
            const data = {
                "author_id": authorId,
                "recipient_id": recipientId
            };
            const viewId = await this.model.create(data);
            res.status(201).json({ message: 'View created', viewId });
        } catch (error) {
            console.log('error = ' + error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteView(req, res) {
        try {
            const viewData = req.body;
            const viewId = this._checkPositiveInteger(viewData.id || '');
            if (viewId < 0) {
                res.status(400).json({ error: "View id is incorrect" });
                return ;
            }
            if (!await this.checkById(viewId)) {
                res.status(400).json({ error: "View doesn't exists" });
                return ;
            }
            const viewIdReturn = await this.model.delete(viewId);
            res.status(201).json({ message: 'view deleted', viewIdReturn });
        } catch (error) {
            console.log('error = ' + error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new ViewsController();