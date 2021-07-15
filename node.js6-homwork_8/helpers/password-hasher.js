const bcrypt = require('bcrypt');

const { usersConst: { SALT }, responseCodes: { WRONG_EMAIL_OR_PASSWORD } } = require('../const');
const { ErrorHandler, errorMessage } = require('../error');

module.exports = {
    compare: async (hashedPassword, password) => {
        const isPasswordMatched = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordMatched) {
            throw new ErrorHandler(WRONG_EMAIL_OR_PASSWORD, errorMessage.WRONG_PASSWORD.massage,
                errorMessage.WRONG_PASSWORD.code);
        }
    },
    hash: (password) => bcrypt.hash(password, SALT)
};
