const {
    DELETE, CREATE,
    UP_DATE, VERIFICATION,
    CHANG_PASSWORD
} = require('../const/email-actions.anum');

module.exports = {
    [CREATE]: {
        templateName: 'create',
        subject: 'You create account'
    },
    [DELETE]: {
        templateName: 'delete',
        subject: 'Your account delete'
    },
    [UP_DATE]: {
        templateName: 'upDate',
        subject: 'Your account upDate'
    },
    [VERIFICATION]: {
        templateName: 'verification',
        subject: 'chek verification'
    },
    [CHANG_PASSWORD]: {
        templateName: 'changPassword',
        subject: 'chang password'
    }
};
