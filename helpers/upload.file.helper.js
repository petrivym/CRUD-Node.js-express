const fs = require('fs');
const path = require('path');
const uuid = require('uuid').v1;
const { promisify } = require('util');

const { STATIC } = require('../const/users.const');

const rmdirPromise = promisify(fs.rmdir);
const mkdirPromise = promisify(fs.mkdir);

module.exports = {
    _fileDirBuilder: async (file, ItemId, typeUploadFile) => {
        const pathWithoutStatic = path.join('users', ItemId.toString(), typeUploadFile);
        const photoDirectory = path.join(process.cwd(), STATIC, pathWithoutStatic);

        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuid()}.${fileExtension}`;

        const finalPath = path.join(photoDirectory, fileName);
        const directoryForDataBase = path.join(pathWithoutStatic, fileName);

        await mkdirPromise(photoDirectory, { recursive: true });

        return {
            directoryForDataBase,
            finalPath
        };
    },

    _fileDirDeleteUser: async (id) => {
        const deletePath = path.join(STATIC, 'users', id.toString());
        await rmdirPromise(deletePath, { recursive: true });
    }
};
