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