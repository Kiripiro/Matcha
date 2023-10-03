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

    _checkString(input, name, length_max, regex) {
        if (input.length <= 0)
            return name + ' is empty';
        if (input.length > length_max)
            return name + ' is too long';
        if (!regex.test(input))
            return name + ' contains prohibited characters';
        return true;
    }

    // Add more common controller methods here
}

module.exports = BaseController;
