const router = require('express').Router();

const { controllers } = require('../controllers');
const { userMiddleware, fileMiddleware, authMiddleware } = require('../middleware');

router.post('/',
    userMiddleware.checkValidCreate,
    fileMiddleware.checkAvatarRegistration,
    controllers.createUser);

router.use('/:id',
    userMiddleware.checkIsPresent,
    authMiddleware.checkToken());

router.get('/:id',
    controllers.getUserById);

router.delete('/:id',
    controllers.deleteUserById);

router.put('/:id',
    userMiddleware.checkValidUpdate,
    controllers.updateUserById);

router.post('/:id/avatar',
    fileMiddleware.checkFilesAvatars,
    controllers.addAvatarById);

router.post('/:id/chengPassword',
    fileMiddleware.checkNewPassword,
    controllers.chengPasswordReq);

module.exports = router;
