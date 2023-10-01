const connection = require('./database');
const fs = require('fs');

const createTableIfNotExists = (tableName, sql) => {
    connection.query(`SHOW TABLES LIKE "${tableName}"`, (err, result) => {
        if (err) throw err;
        if (result.length === 1) {
            console.log(`Table "${tableName}" already exists`);
            return;
        }
        connection.query(sql, (err, result) => {
            if (err) throw err;
            console.log(`Table "${tableName}" has been created`);
        });
    });
}

const createUsersTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )`;

    createTableIfNotExists('users', sql);
}

const createPostsTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`;

    createTableIfNotExists('posts', sql);
}

const runMigrations = () => {
    const migrationsLockFile = './config/database/migrations.lock';
    if (!fs.existsSync(migrationsLockFile)) {
        try {
            fs.writeFileSync(migrationsLockFile, '');

            createUsersTable();
            createPostsTable();

            fs.appendFileSync(migrationsLockFile, 'createUsersTable\n');
            fs.appendFileSync(migrationsLockFile, 'createPostsTable\n');
        } catch (error) {
            console.error('Error running migrations:', error);
        }
    }
}

module.exports = {
    runMigrations
};