
import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest("http://localhost:9090/");


describe('Test router User', function () {

    before(function () {
        this.user =
        {
            "firstName": "gastiii",
            "lastName": "audii",
            "email": "gasaudiii@a.com",
            "age": "34",
            "password": "123"
        };
    });

    // it('Registrar usuario', async function () {

    //     const { statusCode, body } = await requester.post('api/sessions/register').send(this.user);
    //     expect(statusCode).to.be.equal(201);
    //     expect(body).to.have.property('status').equal('success');
    //     console.log('Usuario creado:', this.user);
    // });

    it('Login usuario', async function () {
        const { statusCode } =
            await requester.post('api/sessions/login').send({
                email: this.user.email,
                password: this.user.password
                });

        expect(statusCode).to.be.equal(200);
        console.log('Usuario logueado:', this.user);
    });

    it('Se debe desloguear el usuario', async function () {
        const { statusCode } =
            await requester.get('api/sessions/logout');

        expect(statusCode).to.be.equal(200);
        console.log('Usuario deslogueado:', this.user);
    });

});