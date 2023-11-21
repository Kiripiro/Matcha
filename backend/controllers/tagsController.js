const BaseController = require('./baseController');
const TagsModel = require('../models/tagsModel');
const UserController = require('../controllers/userController');

class TagsController extends BaseController {
    constructor() {
        super(TagsModel);
    }

    async getAllByOwnerId(req, res) {
        try {
            const ownerId = req.params.id;
            const tags = await this.model.findMultiple(["owner_id"], [ownerId])
            if (!tags) {
                res.status(404).json({ error: 'Tag not found' })
                return;
            } else {
                var tagsReturn = [];
                tags.find((row) => row).forEach(element => {
                    tagsReturn.push(element);
                });
                res.json(tagsReturn);
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getTagById(req, res) {
        try {
            const tagId = this._checkPositiveInteger(req.params.id || '');
            if (tagId < 0) {
                res.status(400).json({ error: 'Tag id is incorrect' });
                return;
            }
            const tag = await this.model.findById(tagId);
            if (!tag) {
                res.status(404).json({ error: 'Tag not found' })
                return;
            } else {
                res.json(tag);
            }
            return;
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async createTag(req, res) {
        try {
            const tagData = req.body;
            const checkReturn = this._checkString(tagData.name || '', 'Tag name', 25, /^[a-zA-Z0-9_-]+$/);
            if (checkReturn != true) {
                res.status(400).json({ error: checkReturn });
                return;
            }
            const ownerId = this._checkPositiveInteger(tagData.owner_id || '');
            if (ownerId < 0) {
                res.status(400).json({ error: "Tag owner id is incorrect" });
                return;
            }
            if (!await UserController.checkById(ownerId)) {
                res.status(400).json({ error: "User id doesn't exists" });
                return;
            }
            if (await this.model.check([tagData.name, ownerId])) {
                res.status(400).json({ error: "Tag already exists" });
                return;
            }
            const data = {
                "name": tagData.name,
                "owner_id": ownerId
            };
            const tagId = await this.model.create(data);
            res.status(201).json({ message: 'Tag created', tagId });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteTag(req, res) {
        try {
            const tagData = req.body;
            const tagId = this._checkPositiveInteger(tagData.id || '');
            if (tagId < 0) {
                res.status(400).json({ error: "Tag id is incorrect" });
                return;
            }
            if (!await this.checkById(tagId)) {
                res.status(400).json({ error: "Tag doesn't exists" });
                return;
            }
            const tagIdReturn = await this.model.delete(tagId);
            res.status(201).json({ message: 'Tag deleted', tagIdReturn });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new TagsController();