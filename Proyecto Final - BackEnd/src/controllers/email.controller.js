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
    from: "Coder Ecommerce Audisio,Gaston " + config.gmailAccount,
    to: config.gmailAccount,


    subject: "Correo de prueba Coderhouse Programacion Backend clase 30.",
    html: `<div><h1>Esto es un Test de envio de correos con Nodemailer!</h1></div>`,
    attachments: []
}

const mailOptionsWithAttachments = {
    // Cuerpo del mensaje
    from: "Coder Ecommerce Audisio,Gaston " + config.gmailAccount,
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
                req.logger.error(error);
                res.status(400).send({ message: "Error", payload: error });
            } else {
                req.logger.debug('Message sent: ' + info.messageId);
                res.send({ message: "Success", payload: info });
            }
        });
    } catch (error) {
        req.logger.error(error);
        req.logger.error(`Error al enviar correo: ${getErrorMessage('ERROR_EMAIL')}`);
        res.status(500).send(getErrorMessage('ERROR_EMAIL'));
    }
};

export const sendEmailWithAttachments = async (req, res) => {
    try {
        await transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                req.logger.error(error);
                res.status(400).send({ message: "Error", payload: error });
            } else {
                req.logger.debug('Message sent: ' + info.messageId);
                res.send({ message: "Success", payload: info });
            }
        });
    } catch (error) {
        req.logger.error(error);
        req.logger.error(`Error al enviar correo: ${getErrorMessage('ERROR_EMAIL')}`);
        res.status(500).send(getErrorMessage('ERROR_EMAIL'));
    }
};

export const sendInactiveAccountEmail = async (email) => {
    const inactiveAccountMailOptions = {
        from: "Coder Ecommerce Audisio,Gaston " + config.gmailAccount,
        to: email,
        subject: "Eliminación de cuenta por inactividad",
        html: `<div>
                <h1>Tu cuenta ha sido eliminada por inactividad.</h1>
                <p>Si deseas volver a utilizar nuestros servicios, por favor regístrate nuevamente.</p>
            </div>`,
        attachments: []
    };

    try {
        await transporter.sendMail(inactiveAccountMailOptions);
        console.log(`Correo de eliminación de cuenta enviado a: ${email}`);
    } catch (error) {
        console.error(`Error al enviar correo de eliminación de cuenta a ${email}:`, error);
    }
};

export const sendProductDeletionEmail = async (email, productName) => {
    const productDeletionMailOptions = {
        from: "Coder Ecommerce Audisio,Gaston " + config.gmailAccount,
        to: email,
        subject: "Producto eliminado",
        html: `<div>
                <h1>Producto Eliminado</h1>
                <p>El producto ${productName} ha sido eliminado de nuestra plataforma.</p>
                <p>Para más detalles, por favor contáctanos.</p>
            </div>`,
        attachments: []
    };

    try {
        await transporter.sendMail(productDeletionMailOptions);
        console.log(`Correo de eliminación de producto enviado a: ${email}`);
    } catch (error) {
        console.error(`Error al enviar correo de eliminación de producto a ${email}:`, error);
    }
};