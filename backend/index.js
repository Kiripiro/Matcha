const express = require('express');
const fs = require('fs');
const migrationRunner = require('./config/database/migrationRunner');
const cors = require('cors');

const userRouter = require('./router/userRouter');
const tagsRouter = require('./router/tagsRouter');
const blocksRouter = require('./router/blocksRouter');
const likesRouter = require('./router/likesRouter');
const reportsRouter = require('./router/reportsRouter');
const viewsRouter = require('./router/viewsRouter');
const messagesRouter = require('./router/messagesRouter');

require('dotenv').config();
require('./config/checkEnv');

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

const port = process.env.NODE_PORT;

// Run migrations if migrations.lock file doesn't exist yet
if (!fs.existsSync('./config/database/migrations.lock')) {
    migrationRunner.runMigrations();
}

var corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());

// Examples of GET & POST requests to test DB connection - use routes instead
app.use("/users", userRouter);
app.use("/tags", tagsRouter);
app.use("/blocks", blocksRouter);
app.use("/likes", likesRouter);
app.use("/reports", reportsRouter);
app.use("/views", viewsRouter);
app.use("/messages", messagesRouter);


app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}, http://localhost:${port}`);
});