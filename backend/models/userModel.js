const BaseModel = require('./baseModel');

class UserModel extends BaseModel {
    constructor() {
        super();
        this.tableName = 'users';
    }

    // Use the baseModel findAll method
    async findAll() {
        const users = await super.findAll();
        return users;
    }

    async findById(id) {
        const user = await super.findById(id);
        return user;
    }

    async findByUsername(username) {
        const user = await super.findOne('username', [this.tableName, username]);
        return user;
    }

    async create(userData) {
        const result = await super.create(userData);
        return result;
    }

    // Add more model-specific methods here,like update, delete...
}
module.exports = new UserModel();