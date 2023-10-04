const BaseModel = require('./baseModel');

class LikesModel extends BaseModel {
    constructor() {
        super();
        this.tableName = 'likes';
    }

    async check(values) {
        const item = await this.findMultiple(["author_id", "recipient_id"], values)
        if (item) {
            return true;
        }
        return false;
    }

    async deleteUserLikes(userId) {
        const count = await this.deleteMultipleOrConditions(["author_id", "recipient_id"], [userId, userId]);
        return count;
    }
}
module.exports = new LikesModel();