const EmailTemplates = require('email-templates');
const nodeMailer = require('nodemailer');
const path = require('path');

const {
    usersConst: {
        ROOT_EMAIL,
        NO_REPLY,
        FOLDER_NAME_EMAIL_TEMPLATES,
        ROOT_PASSWORD,
        TRANSPORTER_SERVICE
    },
    responseCodes:
        {
            NO_TOKEN
        }
} = require('../const');
const { ErrorHandler, errorMessage: { WRONG_TEMPLATE } } = require('../error');
const templateInfo = require('../email-templates');

const templateParser = new EmailTemplates({
    views: {
        root: path.join(process.cwd(), FOLDER_NAME_EMAIL_TEMPLATES)
    }
});

const transporter = nodeMailer.createTransport({
    service: TRANSPORTER_SERVICE,
    auth: {
        user: ROOT_EMAIL,
        pass: ROOT_PASSWORD
    }
});

const sendMail = async (userMail, actions, context = {}) => {
    const templateToSend = templateInfo[actions];

    if (!templateToSend) {
        throw new ErrorHandler(NO_TOKEN, WRONG_TEMPLATE.message, WRONG_TEMPLATE.code);
    }

    const html = await templateParser.render(templateToSend.templateName, context);

    return transporter.sendMail({
        from: NO_REPLY,
        to: userMail,
        subject: templateToSend.subject,
        html
    });
};

module.exports = {
    sendMail
};
