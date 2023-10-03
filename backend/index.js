const express = require('express');
const fs = require('fs');
const migrationRunner = require('./config/database/migrationRunner');
const UserController = require('./controllers/userController');

const userRouter = require('./router/userRouter');

require('dotenv').config();

const app = express();
const port = process.env.NODE_PORT;

// Run migrations if migrations.lock file doesn't exist yet
if (!fs.existsSync('./config/database/migrations.lock')) {
    migrationRunner.runMigrations();
}

app.use(express.json());

// Examples of GET & POST requests to test DB connection - use routes instead
app.use("/users", userRouter);

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}, http://localhost:${port}`);
});