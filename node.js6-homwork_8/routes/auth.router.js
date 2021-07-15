const routerAuth = require('express').Router();

const { controllersAuth } = require('../controllers');
const { EMAIL_FIELD, REFRESH } = require('../const/users.const');
const { userMiddleware, authMiddleware } = require('../middleware');

routerAuth.post('/login',
    userMiddleware.getUserByDynamicParam(EMAIL_FIELD),
    authMiddleware.checkAuthorized,
    controllersAuth.login);

routerAuth.post('/logout',
    authMiddleware.checkToken(),
    controllersAuth.logout);

routerAuth.post('/refresh',
    authMiddleware.checkToken(REFRESH),
    controllersAuth.refresh);

routerAuth.get('/activate/:mailToken',
    authMiddleware.checkEmailToken(),
    authMiddleware.checkUpDateDataBase,
    controllersAuth.activateUser);

routerAuth.get('/:mailToken/:newPassword',
    authMiddleware.checkEmailToken(),
    controllersAuth.confirmChangPassword);

module.exports = routerAuth;
