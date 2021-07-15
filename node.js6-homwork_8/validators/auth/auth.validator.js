const Joi = require('joi');

const { usersRolesEnum } = require('../../const');
const { regexp } = require('../../const');

module.exports = {
    authUser: Joi.object().keys({
        email: Joi.string().required().regex(regexp.EMAIL_REGEXP),
        password: Joi.string().required().regex(regexp.PASSWORD_REGEXP),
        role: Joi.string().allow(...Object.values(usersRolesEnum))
    })
};
