

import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command(); //Crea la instancia de comandos de commander.

program
    .option('-d, --debug', 'Variable para debug', false)
    .option('-p, --port <port>', 'Puerto del servidor','3000')
    .option('--mode <mode>', 'Modo de trabajo', 'develop')
program.parse();

console.log("Options: ", program.opts());
console.log("Mode: ", program.opts().mode);
console.log("port: ", program.opts().port);

const environment = program.opts().mode;

dotenv.config({
    path: environment === "production" ? "./config/.env.production" : "./config/.env.development"
});


export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWD,
};

