const { OAuth, User } = require('../dataBase');
const {
    responseCodes,
    usersConst: {
        AUTHORIZATION,
        EMAIL_TOKEN,
        ACCESS,
    },
} = require('../const');
const { ErrorHandler } = require('../error');
const {
    NO_TOKEN,
    WRONG_TOKEN,
    RECORD_NOT_FOUND_BY_PARAM,
    DONOT_UPDATE_DATA_IN_SERVER,
    UNAUTHORIZED
} = require('../error/error-messages');
const { AuthHasher } = require('../helpers');
const { passwordHasher } = require('../helpers');

module.exports = {
    checkAuthorized: async (req, res, next) => {
        try {
            const { password: hashPassword } = req.user;
            const { password } = req.body;

            if (!req.user) {
                throw new ErrorHandler(responseCodes.BAD_REQUEST, RECORD_NOT_FOUND_BY_PARAM.massage,
                    RECORD_NOT_FOUND_BY_PARAM.code);
            }

            if (!req.user.isActivate) {
                throw new ErrorHandler(responseCodes.UNAUTHORIZED, UNAUTHORIZED.massage,
                    UNAUTHORIZED.code);
            }

            await passwordHasher.compare(hashPassword, password);
            next();
        } catch (e) {
            next(e);
        }
    },

    checkToken: (tokenType = ACCESS) => async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            if (!token) {
                throw new ErrorHandler(responseCodes.NO_TOKEN, NO_TOKEN.massage, NO_TOKEN.code);
            }

            await AuthHasher.verifyToken(token, tokenType);

            const tokenObject = await OAuth.findOne({ [tokenType]: token });

            if (!tokenObject) {
                throw new ErrorHandler(responseCodes.WRONG_TOKEN, WRONG_TOKEN.message, WRONG_TOKEN.code);
            }

            req.user = tokenObject.user;
            next();
        } catch (e) {
            next(e);
        }
    },

    checkEmailToken: (tokenType = EMAIL_TOKEN) => async (req, res, next) => {
        try {
            const { mailToken } = req.params;

            if (!mailToken) {
                throw new ErrorHandler(responseCodes.NO_TOKEN, NO_TOKEN.massage, NO_TOKEN.code);
            }

            await AuthHasher.verifyEmailToken(mailToken, tokenType);

            const tokenObject = await User.findOne({ [tokenType]: mailToken });

            if (!tokenObject) {
                throw new ErrorHandler(responseCodes.WRONG_TOKEN, WRONG_TOKEN.message, WRONG_TOKEN.code);
            }

            req.user = tokenObject;
            next();
        } catch (e) {
            next(e);
        }
    },

    checkUpDateDataBase: async (req, res, next) => {
        try {
            const { id } = req.user;

            const updateResult = await User.updateMany({ _id: id }, { isActivate: true, emailToken: '' });

            if (!updateResult.n) {
                throw new ErrorHandler(responseCodes.INTERNAL_SERVER_ERROR, DONOT_UPDATE_DATA_IN_SERVER.massage,
                    DONOT_UPDATE_DATA_IN_SERVER.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },
};
