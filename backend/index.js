const express = require('express');
const fs = require('fs');
const migrationRunner = require('./config/database/migrationRunner');
const UserController = require('./controllers/userController');

require('dotenv').config();

const app = express();
const port = process.env.NODE_PORT;

// Run migrations if migrations.lock file doesn't exist yet
if (!fs.existsSync('./config/database/migrations.lock')) {
    migrationRunner.runMigrations();
}

app.use(express.json());

// Examples of GET & POST requests to test DB connection - use routes instead
app.post('/users', async (req, res) => {
    try {
        await UserController.createUser(req, res);
    } catch (error) {
        console.error(error);
    }
});

app.post('/users/update', async (req, res) => {
    try {
        await UserController.updateInfos(req, res);
    } catch (error) {
        console.error(error);
    }
});

app.get('/users', async (req, res) => {
    try {
        await UserController.getAllUsers(req, res);
    } catch (error) {
        console.error(error);
    }
});

app.get('/users/:id', async (req, res) => {
    res.send('Hello mec!');
    try {
        await UserController.getUserById(req, res);
        res.send('Hello, ww!');
    } catch (error) {
        console.error(error);
    }
});

app.get('/test/:id', async (req, res) => {
    console.log(req.params);
    // console.log(res);
    // res.send('Hello, Test!');
    try {
        await UserController.getById(req, res);
        // res.send('Hello, ww!');
    } catch (error) {
        console.error(error);
    }
});

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}, http://localhost:${port}`);
});