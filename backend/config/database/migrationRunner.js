const connection = require('./database');
const fs = require('fs');

const createUsersTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )`;

    connection.query('SHOW TABLES LIKE "users"', (err, result) => {
        if (err) throw err;
        if (result.length === 1) {
            console.log('Table "users" already exists');
            return;
        }
        connection.query(sql, (err, result) => {
            if (err) throw err;
            console.log('Table "users" has been created');
        });
    });
}

const createPostsTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`;

    connection.query('SHOW TABLES LIKE "posts"', (err, result) => {
        if (err) throw err;
        if (result.length === 1) {
            console.log('Table "posts" already exists');
            return;
        }
        connection.query(sql, (err, result) => {
            if (err) throw err;
            console.log('Table "posts" has been created');
        });
    });
}

// Add more migrations here - don't forget to append the migration name to migrations.lock file
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

