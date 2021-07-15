const { Schema, model } = require('mongoose');

const { usersRolesEnum } = require('../const');

const OAuthSchema = new Schema({
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: usersRolesEnum.USER
    },
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

OAuthSchema.pre('findOne', function() {
    this.populate('user');
});

module.exports = model(usersRolesEnum.O_AUTH, OAuthSchema);
