const {
    usersConst: { AUTHORIZATION },
    emailActionEnum: { CREATE },
    responseCodes: { DELETE, CREATED_OR_UPDATE }
} = require('../const');
const { OAuth, User } = require('../dataBase');
const { AuthHasher, passwordHasher, normalize: { userNormalizator } } = require('../helpers');
const { mailerServices } = require('../services');

module.exports = {
    login: async (req, res, next) => {
        try {
            const { _id } = req.user;
            const tokePair = AuthHasher.generateTokenPair();

            await OAuth.create({
                ...tokePair,
                user: _id
            });

            const userNormalize = userNormalizator(req.user.toObject());

            res.json({
                ...tokePair,
                user: userNormalize
            });
        } catch (e) {
            next(e);
        }
    },

    logout: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);

            await OAuth.remove({ accessToken: token });

            res.status(DELETE).json('Success');
        } catch (e) {
            next(e);
        }
    },

    refresh: async (req, res, next) => {
        try {
            const token = req.get(AUTHORIZATION);
            const tokePair = AuthHasher.generateTokenPair();

            await OAuth.remove({ refreshToken: token });

            await OAuth.create({
                ...tokePair,
                user: req.user
            });

            res.status(CREATED_OR_UPDATE).json({ ...tokePair });
        } catch (e) {
            next(e);
        }
    },

    activateUser: async (req, res, next) => {
        try {
            const { email } = req.user;

            await mailerServices.sendMail(email, CREATE, { email });

            res.status(CREATED_OR_UPDATE).json('Success');
        } catch (e) {
            next(e);
        }
    },
    confirmChangPassword: async (req, res, next) => {
        try {
            const { newPassword } = req.params;
            const { _id } = req.user;

            const hashedPassword = await passwordHasher.hash(newPassword);

            await User.updateMany({ _id }, { password: hashedPassword, emailToken: '' });

            res.status(200).json('Success');
        } catch (e) {
            next(e);
        }
    },
};
