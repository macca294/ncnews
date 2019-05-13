const express = require('express');
const apiRouter = require('./routes/api');
const {
    routeNotFound,
    handle400,
    handle404,
    handle500
} = require('./errors');
const cors = require('cors')
const app = express();

app.use(cors())

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', routeNotFound);

app.use(handle400);
app.use(handle404);
app.use(handle500);

module.exports = app;