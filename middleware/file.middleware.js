const {
    responseCodes: {
        CONFLICT,
        NOT_FOUND_ERR,
        BAD_REQUEST
    },
    usersConst: {
        PHOTO_MAX_SIZE,
        PHOTOS_MIMETYPES,
    }
} = require('../const');
const {
    errorMessage: {
        WRONG_PASSWORD,
        MEMORY_LIMIT_PHOTO,
        WRONG_FILE_FORMAT,
        TO_MANY_PHOTOS,
        INCORRECT_COUNT_PHOTOS,
        RECORD_NOT_FOUND_BY_AVATAR
    },
    ErrorHandler
} = require('../error');
const { validator } = require('../validators/index');

module.exports = {
    checkAvatarRegistration: (req, res, next) => {
        try {
            if (!req.files) {
                throw new ErrorHandler(NOT_FOUND_ERR, RECORD_NOT_FOUND_BY_AVATAR.massage, RECORD_NOT_FOUND_BY_AVATAR.code);
            }

            const filesPhoto = Object.values(req.files);

            if (!(filesPhoto.length === 1)) {
                throw new ErrorHandler(CONFLICT, TO_MANY_PHOTOS.message, TO_MANY_PHOTOS.code);
            }

            const photos = [];

            for (const photo of filesPhoto) {
                const { size, mimetype } = photo;

                if (PHOTOS_MIMETYPES.includes(mimetype)) {
                    if (size > PHOTO_MAX_SIZE) {
                        throw new ErrorHandler(CONFLICT, MEMORY_LIMIT_PHOTO.message, MEMORY_LIMIT_PHOTO.code);
                    }

                    photos.push(photo);
                } else {
                    throw new ErrorHandler(CONFLICT, WRONG_FILE_FORMAT.message, WRONG_FILE_FORMAT.code);
                }
            }

            req.photos = photos;

            next();
        } catch (e) {
            next(e);
        }
    },

    checkFilesAvatars: (req, res, next) => {
        try {
            const files = Object.values(req.files);

            const photos = [];

            if (!(files.length > 0 && files.length <= 10)) {
                throw new ErrorHandler(CONFLICT, INCORRECT_COUNT_PHOTOS.message, INCORRECT_COUNT_PHOTOS.code);
            }
            for (const file of files) {
                for (const photoFile of file) {
                    const { size, mimetype } = photoFile;

                    if (PHOTOS_MIMETYPES.includes(mimetype)) {
                        if (size > PHOTO_MAX_SIZE) {
                            throw new ErrorHandler(CONFLICT, MEMORY_LIMIT_PHOTO.message, MEMORY_LIMIT_PHOTO.code);
                        }

                        photos.push(photoFile);
                    } else {
                        throw new ErrorHandler(CONFLICT, WRONG_FILE_FORMAT.message, WRONG_FILE_FORMAT.code);
                    }
                }
            }

            req.photos = photos;
            next();
        } catch (e) {
            next(e);
        }
    },

    checkNewPassword: (req, res, next) => {
        try {
            const { newPassword } = req.body;

            const { error } = validator.updatePassword.validate(req.body);

            if (error) {
                throw new ErrorHandler(BAD_REQUEST, error.details[0].message, WRONG_PASSWORD.code);
            }

            req.newPassword = newPassword;
            next();
        } catch (e) {
            next(e);
        }
    },
};
