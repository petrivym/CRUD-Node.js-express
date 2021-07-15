const Joi = require('joi');

const { usersRolesEnum, regexp } = require('../../const');

module.exports = {
    createUser: Joi.object().keys({
        login: Joi.string().required().min(3).max(20),
        email: Joi.string().required().regex(regexp.EMAIL_REGEXP),
        password: Joi.string().required().regex(regexp.PASSWORD_REGEXP),
        role: Joi.string().allow(...Object.values(usersRolesEnum))
    }),

    updateUser: Joi.object().keys({
        login: Joi.string().min(3).max(20),
    }),

    updatePassword: Joi.object().keys({
        newPassword: Joi.string().required().regex(regexp.PASSWORD_REGEXP)
    }),
};
