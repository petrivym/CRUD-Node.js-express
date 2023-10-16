const { responseCodes, usersConst: { BODY } } = require('../const');
const { User } = require('../dataBase');
const {
    errorMessage: {
        RECORD_NOT_FOUND_BY_ID,
        ERROR_EMAIL_CONFLICT,
        WRONG_PASSWORD,
        ERROR_LOGIN_CONFLICT
    },
    ErrorHandler
} = require('../error');
const { validator } = require('../validators/index');

module.exports = {
    checkIsPresent: async (req, res, next) => {
        try {
            const { id } = req.params;

            const userById = await User.findById(id);

            if (!userById || userById.isDelete) {
                throw new ErrorHandler(responseCodes.BAD_REQUEST, RECORD_NOT_FOUND_BY_ID.massage, RECORD_NOT_FOUND_BY_ID.code);
            }

            req.user = userById;
            next();
        } catch (e) {
            next(e);
        }
    },

    checkValidUpdate: async (req, res, next) => {
        try {
            const { login } = req.body;
            const { error } = validator.updateUser.validate(req.body);
            console.log(error);

            const loginDb = await User.findOne({ login });

            if (loginDb) {
                throw new ErrorHandler(responseCodes.CONFLICT, ERROR_LOGIN_CONFLICT.massage, ERROR_LOGIN_CONFLICT.code);
            }

            if (error) {
                throw new ErrorHandler(responseCodes.BAD_REQUEST, error.details[0].message, WRONG_PASSWORD.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    checkValidCreate: async (req, res, next) => {
        try {
            const { login, email } = req.body;
            const { error } = validator.createUser.validate(req.body);

            const emailDb = await User.findOne({ email });
            const loginDb = await User.findOne({ login });

            if (error) {
                throw new ErrorHandler(responseCodes.BAD_REQUEST, error.details[0].message, WRONG_PASSWORD.code);
            }

            if (emailDb) {
                throw new ErrorHandler(responseCodes.CONFLICT, ERROR_EMAIL_CONFLICT.massage, ERROR_EMAIL_CONFLICT.code);
            }

            if (loginDb) {
                throw new ErrorHandler(responseCodes.CONFLICT, ERROR_LOGIN_CONFLICT.massage, ERROR_LOGIN_CONFLICT.code);
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    getUserByDynamicParam: (paramName, searchIn = BODY, dbKey = paramName) => async (req, res, next) => {
        try {
            const valueOfParams = req[searchIn][paramName];
            const user = await User.findOne({ [dbKey]: valueOfParams });

            req.user = user;
            next();
        } catch (e) {
            next(e);
        }
    }
};
