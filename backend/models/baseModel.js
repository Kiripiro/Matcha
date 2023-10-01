const mysql = require('mysql2/promise');
const connection = require('../config/database/database');

// Base model for all models
class BaseModel {
    constructor() {
        this.pool = mysql.createPool(connection.config);
    }

    async query(sql, values) {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.query(sql, values);
            return rows;
        } finally {
            connection.release();
        }
    }

    async findOne(condition, values) {
        const sql = `SELECT * FROM ${this.tableName} WHERE ${condition} = ?`;
        const rows = await this.query(sql, values);
        return rows[0];
    }

    async findById(id) {
        return this.findOne('id', [id]);
    }

    async findAll() {
        const sql = `SELECT * FROM ${this.tableName}`;
        return this.query(sql);
    }

    async create(data) {
        const sql = `INSERT INTO ${this.tableName} SET ?`;
        const result = await this.query(sql, data);
        return result.insertId;
    }

    // Add more common model methods here like update, delete...
}

module.exports = BaseModel;
