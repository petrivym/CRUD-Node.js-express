const {
    responseCodes,
    usersConst,
    emailActionEnum: {
        VERIFICATION,
        DELETE,
        UP_DATE,
        CHANG_PASSWORD
    },
    usersConst: { PHOTOS }
} = require('../const');
const { User } = require('../dataBase');
const {
    passwordHasher,
    AuthHasher: { generateEmailToken },
    fileDirBuilder: {
        _fileDirBuilder,
        _fileDirDeleteUser
    },
    normalize: {
        userNormalizator
    }
} = require('../helpers');
const { mailerServices } = require('../services');

module.exports = {
    getUserById: (req, res, next) => {
        try {
            const { user } = req;

            const userNormalize = userNormalizator(user.toObject());

            res.status(responseCodes.SUCCESS).json(userNormalize);
        } catch (e) {
            next(e);
        }
    },

    createUser: async (req, res, next) => {
        try {
            const {
                body: {
                    password,
                    email
                },
                photos
            } = req;

            const hashedPassword = await passwordHasher.hash(password);
            const { emailToken } = await generateEmailToken();

            const createdUser = await User.create({ ...req.body, password: hashedPassword, emailToken });

            const { _id } = createdUser;
            const [avatar] = photos;

            const { directoryForDataBase, finalPath } = await _fileDirBuilder(avatar, _id, PHOTOS);
            await avatar.mv(finalPath);
            await User.updateMany({ _id }, { avatar: directoryForDataBase, $push: { avatars: directoryForDataBase } });

            await mailerServices.sendMail(email, VERIFICATION, { emailToken });

            const userNormalize = userNormalizator(createdUser.toObject());

            res.status(responseCodes.CREATED_OR_UPDATE).json(userNormalize);
        } catch (e) {
            next(e);
        }
    },

    deleteUserById: async (req, res, next) => {
        try {
            const { id, email } = req.user;

            await _fileDirDeleteUser(id);
            await User.updateMany({ _id: id }, { $set: { avatar: '', avatars: [''], isDelete: true } });

            await mailerServices.sendMail(email, DELETE, {});

            res.sendStatus(responseCodes.DELETE);
        } catch (e) {
            next(e);
        }
    },

    updateUserById: async (req, res, next) => {
        try {
            const { body, user } = req;

            await User.findByIdAndUpdate(user._id, { ...user, ...body });

            await mailerServices.sendMail(user.email, UP_DATE, {});

            res.status(responseCodes.CREATED_OR_UPDATE).json(usersConst.FILE_IS_UPDATE);
        } catch (e) {
            next(e);
        }
    },

    addAvatarById: async (req, res, next) => {
        try {
            const { photos, params: { id } } = req;
            const avatarsPhoto = [];

            for (const photo of photos) {
                const { directoryForDataBase, finalPath } = await _fileDirBuilder(photo, id, PHOTOS);

                await photo.mv(finalPath);

                avatarsPhoto.push(directoryForDataBase);
            }

            await User.updateMany({ _id: id }, {
                $push: { avatars: [...avatarsPhoto] },
                $set: { avatar: avatarsPhoto[avatarsPhoto.length - 1] }
            });

            res.status(200).json('accuses');
        } catch (e) {
            next(e);
        }
    },

    chengPasswordReq: async (req, res, next) => {
        try {
            const { newPassword } = req;
            const { email, id } = req.user;
            const { emailToken } = await generateEmailToken();

            await User.updateOne({ _id: id }, { emailToken });

            await mailerServices.sendMail(email, CHANG_PASSWORD, { newPassword, emailToken });
            res.json('Success');
        } catch (e) {
            next(e);
        }
    }
};
