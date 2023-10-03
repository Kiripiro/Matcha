const mysql = require('mysql2/promise');
const connection = require('../config/database/database');

// Base model for all models
class BaseModel {
    constructor() {
        this.pool = mysql.createPool(connection.config);
    }

    async _query(sql, values) {
        const conn = await this.pool.getConnection();
        try {
            const rows = await conn.query(sql, values);
            return rows;
        } catch(error) {
            console.log('error = ' + error);
        } finally {
            conn.release();
        }
    }

    async findOne(condition, values) {
        const sql = `SELECT * FROM ${this.tableName} WHERE ${condition} = ?`;
        const rows = await this._query(sql, values);
        if (rows.find((row) => row).length <= 0) {
            return null;
        }
        return rows[0][0];
    }

    async findById(id) {
        return await this.findOne('id', [id]);
    }

    async findAll() {
        const sql = `SELECT * FROM ${this.tableName}`;
        return this._query(sql);
    }

    async create(data) {
        const sql = `INSERT INTO ${this.tableName} SET ?`;
        const result = await this._query(sql, data);
        return result.insertId;
    }

    async update(id, data) {
        const sql = `UPDATE ${this.tableName} SET ? WHERE id = ${id}`;
        const result = await this._query(sql, data);
        return result.insertId;
    }

    // Add more common model methods here like update, delete...
}

module.exports = BaseModel;
