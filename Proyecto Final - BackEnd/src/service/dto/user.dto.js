export default class UserDto{
    constructor (user) {
        this.fullName = this.name + " " + this.lastName;
        this.age = user.age;
        this.email = user.email_address;
    }
};