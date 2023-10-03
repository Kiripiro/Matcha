const BaseModel = require('./baseModel');

class UserModel extends BaseModel {
    constructor() {
        super();
        this.tableName = 'users';
    }

    async findByUsername(username) {
        const user = await super.findOne('username', username);
        return user;
    }

    async findByEmail(email) {
        const user = await super.findOne('email', email);
        return user;
    }

    // Add more model-specific methods here,like update, delete...
}
module.exports = new UserModel();