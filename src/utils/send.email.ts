import nodemailer from "nodemailer";

const sendEmail = async (message: { emailFrom: string, emailTo: string, subject: string, message: string }) => {

    const transpoter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });

    const options = {
        from: `${process.env.EMAIL_FROM_NAME} <${message.emailFrom}>`,
        to: message.emailTo,
        subject: message.subject,
        html: message.message
    };

    await transpoter.sendMail(options);
};

export default sendEmail;