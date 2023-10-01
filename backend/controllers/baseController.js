// Base controller for all controllers
class BaseController {
    constructor(model) {
        this.model = model;
    }

    async getAll(req, res) {
        try {
            const items = await this.model.findAll();
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getById(req, res) {
        try {
            const itemId = req.params.id;
            const item = await this.model.findById(itemId);
            if (!item) {
                return res.status(404).json({ error: 'Item not found' });
            }
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Add more common controller methods here
}

module.exports = BaseController;
