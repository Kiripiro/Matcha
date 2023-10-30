const connection = require('./database');
const fs = require('fs');
const initUsers = require('./initUsers');

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
            if (tableName == 'users') {
                initUsers.insertInitialUsers();
                console.log("All these beautiful people were inserted into my grandmother")
            }
        });
    });
}

const createUsersTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        username VARCHAR(255) NOT NULL, 
        email VARCHAR(255) NOT NULL, 
        password VARCHAR(255) NOT NULL, 
        first_name VARCHAR(255) NOT NULL, 
        last_name VARCHAR(255) NOT NULL, 
        age INT NOT NULL, 
        token VARCHAR(255),
        token_creation TIMESTAMP,
        token_expiration TIMESTAMP,
        email_checked BOOLEAN NOT NULL,
        complete_register BOOLEAN DEFAULT FALSE,
        gender VARCHAR(255), 
        sexual_preferences VARCHAR(255), 
        biography VARCHAR(512), 
        picture_1 VARCHAR(255), 
        picture_2 VARCHAR(255), 
        picture_3 VARCHAR(255), 
        picture_4 VARCHAR(255), 
        picture_5 VARCHAR(255), 
        fame_rating INT, 
        location_permission boolean NOT NULL, 
        last_connection TIMESTAMP, 
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`;

    createTableIfNotExists('users', sql);
}// VARCHAR(512) max length 4096 char
//TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP to see if it works

const createTagsTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        owner_id INT NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES users(id)
    )`;

    createTableIfNotExists('tags', sql);
}

const createViewsTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS views (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        author_id INT NOT NULL, 
        recipient_id INT NOT NULL, 
        FOREIGN KEY (author_id) REFERENCES users(id), 
        FOREIGN KEY (recipient_id) REFERENCES users(id)
    )`;

    createTableIfNotExists('views', sql);
}

const createLikesTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS likes (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        author_id INT NOT NULL, 
        recipient_id INT NOT NULL, 
        FOREIGN KEY (author_id) REFERENCES users(id), 
        FOREIGN KEY (recipient_id) REFERENCES users(id)
    )`;

    createTableIfNotExists('likes', sql);
}

const createReportsTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        author_id INT NOT NULL, 
        recipient_id INT NOT NULL, 
        FOREIGN KEY (author_id) REFERENCES users(id), 
        FOREIGN KEY (recipient_id) REFERENCES users(id)
    )`;

    createTableIfNotExists('reports', sql);
}

const createBlocksTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS blocks (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        author_id INT NOT NULL, 
        recipient_id INT NOT NULL, 
        FOREIGN KEY (author_id) REFERENCES users(id), 
        FOREIGN KEY (recipient_id) REFERENCES users(id)
    )`;

    createTableIfNotExists('blocks', sql);
}

const createMessagesTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        author_id INT NOT NULL, 
        recipient_id INT NOT NULL, 
        message VARCHAR(255) NOT NULL, 
        date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
        FOREIGN KEY (author_id) REFERENCES users(id), 
        FOREIGN KEY (recipient_id) REFERENCES users(id)
    )`;

    createTableIfNotExists('messages', sql);
}

const createInvalidTokenTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS invalidTokens (
        id INT AUTO_INCREMENT PRIMARY KEY, 
        token VARCHAR(255),
        refresh_token VARCHAR(255)
    )`;

    createTableIfNotExists('invalidTokens', sql);
}

const runMigrations = () => {
    const migrationsLockFile = './config/database/migrations.lock';
    if (!fs.existsSync(migrationsLockFile)) {
        try {
            fs.writeFileSync(migrationsLockFile, '');

            createUsersTable();
            createTagsTable();
            createViewsTable();
            createLikesTable();
            createReportsTable();
            createBlocksTable();
            createMessagesTable();
            createInvalidTokenTable();

            fs.appendFileSync(migrationsLockFile, 'createUsersTable\n');
            fs.appendFileSync(migrationsLockFile, 'createTagsTable\n');
            fs.appendFileSync(migrationsLockFile, 'createViewsTable\n');
            fs.appendFileSync(migrationsLockFile, 'createLikesTable\n');
            fs.appendFileSync(migrationsLockFile, 'createReportsTable\n');
            fs.appendFileSync(migrationsLockFile, 'createBlocksTable\n');
            fs.appendFileSync(migrationsLockFile, 'createMessagesTable\n');
            fs.appendFileSync(migrationsLockFile, 'createInvalidTokensTable\n');

        } catch (error) {
            console.error('Error running migrations:', error);
        }
    }
}

module.exports = {
    runMigrations
};