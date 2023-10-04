const BaseModel = require('./baseModel');

class TagsModel extends BaseModel {
    constructor() {
        super();
        this.tableName = 'tags';
    }

    async check(values) {
        const item = await this.findMultiple(["name", "owner_id"], values)
        if (item) {
            return true;
        }
        return false;
    }

    async deleteUserTags(userId) {
        const count = await this.deleteMultipleOrConditions(["owner_id"], [userId]);
        return count;
    }
}
module.exports = new TagsModel();