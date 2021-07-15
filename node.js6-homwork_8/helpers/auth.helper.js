const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    EMAIL_TOKEN_SECRET,
    LIFE_CYCLE_ACCESS_TOKEN,
    LIFE_CYCLE_REFRESH_TOKEN,
    ACCESS,
    EMAIL_TOKEN
} = require('../const/users.const');

const verifyPromise = promisify(jwt.verify);

module.exports = {
    generateTokenPair: () => {
        const accessToken = jwt.sign({}, ACCESS_TOKEN_SECRET, { expiresIn: LIFE_CYCLE_ACCESS_TOKEN });
        const refreshToken = jwt.sign({}, REFRESH_TOKEN_SECRET, { expiresIn: LIFE_CYCLE_REFRESH_TOKEN });

        return {
            accessToken,
            refreshToken
        };
    },
    generateEmailToken: () => {
        const emailToken = jwt.sign({}, EMAIL_TOKEN_SECRET, { expiresIn: LIFE_CYCLE_ACCESS_TOKEN });

        return {
            emailToken,
        };
    },

    verifyToken: async (token, tokenType = ACCESS) => {
        const secretWorld = tokenType === ACCESS ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

        await verifyPromise(token, secretWorld, tokenType);
    },

    verifyEmailToken: async (token, tokenType = EMAIL_TOKEN) => {
        await verifyPromise(token, EMAIL_TOKEN_SECRET, tokenType);
    }
};
