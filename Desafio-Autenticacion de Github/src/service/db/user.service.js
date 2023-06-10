import userModel from "./models/user.js";

export default class UserServiceMongo {
    constructor() { 
        console.log("Working students with Database persistence in mongodb");
    }

    getAll = async () => {
        let users = await userModel.find();
        return users.map(student=>student.toObject());
    }
    save = async (user) => {
        let result = await userModel.create(user);
        return result;
    }

    findByUsername = async (username) => {
        const result = await userModel.findOne({email: username});
        return result;
    };

    update = async (filter, value) => {
        console.log("Update student with filter and value:");
        console.log(filter);
        console.log(value);
        let result = await userModel.updateOne(filter, value);
        return result;
    }
}