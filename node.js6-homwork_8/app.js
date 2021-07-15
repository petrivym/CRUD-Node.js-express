const express = require('express');
const fileUplead = require('express-fileupload');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const { RECORD_NOT_FOUND } = require('./error/error-messages');
const { usersRouter, authRouter } = require('./routes');
const { usersConst, responseCodes } = require('./const');

const app = express();
_mongooseConnector();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'static')));

app.use(fileUplead({}));
app.use('/users', usersRouter);
        app.use('/auth', authRouter);
app.use('*', _notFoundHandler);
app.use(_handleErrors);

app.listen(usersConst.PORT, () => {
    console.log(`app listen ${usersConst.PORT}`);
});

// eslint-disable-next-line no-unused-vars
function _handleErrors(err, req, res, next) {
    res
        // .status(err.status)
        .json({
            message: err.message || usersConst.UNKNOWN_ERROR,
            customCode: err.code || responseCodes.UNKNOWN_ERROR
        });
}

function _notFoundHandler(req, res, next) {
    next({
        status: responseCodes.NOT_FOUND_ERR,
        message: RECORD_NOT_FOUND.massage,
        code: RECORD_NOT_FOUND.code
    });
}

function _mongooseConnector() {
    mongoose.connect(usersConst.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
}
