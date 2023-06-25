import nodemailer from 'nodemailer';
import config from '../config/config.js';
import __dirname from '../utils.js'
import { getErrorMessage } from './errorHandler.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

const mailOptions = {
    // Cuerpo del mensaje
    from: "Coder Test " + config.gmailAccount,
    to: config.gmailAccount,


    subject: "Correo de prueba Coderhouse Programacion Backend clase 30.",
    html: `<div><h1>Esto es un Test de envio de correos con Nodemailer!</h1></div>`,
    attachments: []
}

const mailOptionsWithAttachments = {
    // Cuerpo del mensaje
    from: "Coder Test " + config.gmailAccount,
    to: config.gmailAccount,

    subject: "Correo de prueba Coderhouse Programacion Backend clase 30.",
    html: `<div>
                <h1>Esto es un Test de envio de correos con Nodemailer!</h1>
                <p>Ahora usando imagenes: </p>
                <img src="cid:meme"/>
            </div>`,
    attachments: [
        {
            filename: 'Meme de Programacion',
            path: __dirname + "/public/images/meme.png",
            cid: "meme"
        }
    ]
}

export const sendEmail = async (req, res) => {
    try {
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error });
            } else {
                console.log('Message sent: ', info.messageId);
                res.send({ message: "Success", payload: info });
            }
        });
    } catch (error) {
        console.error(error);
        console.error(`Error al enviar correo: ${getErrorMessage('ERROR_EMAIL')}`);
        res.status(500).send(getErrorMessage('ERROR_EMAIL'));
    }
};

export const sendEmailWithAttachments = async (req, res) => {
    try {
        await transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error });
            } else {
                console.log('Message sent: ', info.messageId);
                res.send({ message: "Success", payload: info });
            }
        });
    } catch (error) {
        console.error(error);
        console.error(`Error al enviar correo: ${getErrorMessage('ERROR_EMAIL')}`);
        res.status(500).send(getErrorMessage('ERROR_EMAIL'));
    }
};