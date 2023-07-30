import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest("http://localhost:9090/api/carts");


describe('Test router Cart', function () {

    it('Debe crear un cart', async function () {
        const { statusCode, body } = await requester.post('/');
        expect(statusCode).to.be.ok;
        expect(body).to.have.a.property('_id');
        this.cartId = body._id;
        console.log('Carrito creado con ID:', this.cartId);
    });

    it('Debe eliminar el cart', async function () {
        const { statusCode, body } = await requester.delete('/');
        expect(statusCode).to.be.ok;
    });


});


