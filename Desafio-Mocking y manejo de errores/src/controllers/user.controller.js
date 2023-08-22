import { userModel } from '../models/user.model.js';
import { generateUser } from '../utils.js'

export const getUsers = async (req, res) => {
    try {
        let users = [];
        for (let i = 0; i < 100; i++) {
            users.push(generateUser());
        }
        res.send({ status: "success", payload: users });
    } catch (error) {
        req.logger.error(error);
        res.status(500).send(getErrorMessage('ERROR_USER'));
    }
};

export const allUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        console.log(users);
        res.render("allUsers", { users: JSON.parse(JSON.stringify(users)) }); 
    } catch (error) {
        req.logger.error(error);
        res.status(500).send(getErrorMessage('ERROR_USER'));
    }
};