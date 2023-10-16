const { Schema, model } = require('mongoose');

const { usersRolesEnum } = require('../const');

const userSchema = new Schema({
    login: {
        type: String,
        required: true,
        max: 20
    },
    avatar: {
        type: String,
    },

    avatars: {
        type: [],
    },

    password: {
        type: String,
        select: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    isActivate: {
        type: Boolean,
        required: true,
        default: false
    },

    isDelete: {
        type: Boolean,
        required: true,
        default: false
    },

    emailToken: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(usersRolesEnum),
        required: true,
        default: usersRolesEnum.USER
    },
}, { timestamps: true });

module.exports = model(usersRolesEnum.USER, userSchema);
