module.exports = {
    PORT: process.env.PORT || 3000,
    mongodb: process.env.mongodb || 'mongodb://localhost:27017/user',
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'secretToken',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'refereshSecretToken',
    EMAIL_TOKEN_SECRET: process.env.EMAIL_TOKEN_SECRET || 'some word',
    ROOT_EMAIL: process.env.ROOT_EMAIL || 'some.mail.com',
    ROOT_PASSWORD: process.env.ROOT_PASSWORD || 'xxx',
    NOT_FOUND_ERR: 'user not found',
    FIELDS_ARE_EMPTY_ERR: 'some fields are empty',
    FILE_IS_UPDATE: 'files is update',
    EMAIL_IS_ALREADY_USE: 'this email is already in use',
    DELETE_STATUS_SUCCESS: 'success delete',
    UNKNOWN_ERROR: 'Unknown error',
    DATABASE_IS_EMPTY: 'database is empty',
    AUTHORIZATION: 'AUTHORIZATION',
    LIFE_CYCLE_ACCESS_TOKEN: '10m',
    LIFE_CYCLE_REFRESH_TOKEN: '31d',
    ACCESS: 'accessToken',
    REFRESH: 'refreshToken',
    BODY: 'body',
    EMAIL_FIELD: 'email',
    EMAIL_TOKEN: 'emailToken',
    SALT: 10,
    TRANSPORTER_SERVICE: 'gmail',
    NO_REPLY: 'No Reply',
    FOLDER_NAME_EMAIL_TEMPLATES: 'email-templates',
    VIDEOS: 'videos',
    PHOTOS: 'photos',
    DOCUMENTS: 'documents',
    STATIC: 'static',

    PHOTO_MAX_SIZE: 2 * 1024 * 1024, // 2MB

    PHOTOS_MIMETYPES: [
        'image/gif',
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/tiff',
        'image/webp'
    ],
};
