
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

    it('Registrar usuario', async function () {

        const { statusCode, body } = await requester.post('api/sessions/register').send(this.user);
        expect(statusCode).to.be.equal(201);
        expect(body).to.have.property('status').equal('success');
        console.log('Usuario creado:', this.user);
    });

    // it('El login debe fallar', async function () {
    //     const { statusCode, headers, body, ...rest } =
    //         await requester
    //             .post('login')
    //             .send({
    //                 email: this.user.email,
    //                 password: 'password'
    //             });


    //     expect(statusCode).to.be.equal(302);
    //     expect(headers).to.have.property('location', '/login');
    // });

    // it('Login de usuario', async function () {
    //     const { statusCode, headers } =
    //         await requester
    //             .post('login')
    //             .send({
    //                 email: this.user.email,
    //                 password: this.user.password
    //             });

    //     expect(statusCode).to.be.equal(302);
    //     expect(headers).to.have.property('location', '/products');
    // });

    // it('Se debe desloguear el usuario logueado correctamente', async function () {
    //     const { statusCode, headers, body, ...rest } =
    //         await requester.get('logout');

    //     expect(statusCode).to.be.equal(302);
    //     expect(headers).to.have.property('location', '/login');
    // });

});