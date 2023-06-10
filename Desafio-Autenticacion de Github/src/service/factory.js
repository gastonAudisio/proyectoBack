import config from '../config/config.js';
import MongoSingleton from '../config/mongodb-singleton.js';

// Para cambiar de persistencia
// node src/app.js --persist files --mode dev

let userService

switch (config.persistence) {
    case 'mongodb':
        const mongoInstance = async () => {
            console.log("Entrando a iniciar Service para MongoDb");
            try {
                await MongoSingleton.getInstance();
            } catch (error) {
                console.error(error);
                process.exit(0);
            }
        };
        mongoInstance();
        const { default: UserServiceMongo } = await import('./db/user.service.js')
        userService = new UserServiceMongo();
        console.log("User service loaded:");
        console.log(userService);
        break;
    case 'files':
        const { default: UserServiceFileSystem } = await import('./fileSystem/user.service.js')
        userService = new UserServiceFileSystem();
        console.log("User service loaded:");
        console.log(userService);
        break;

    default:
        break;
}

export { userService }