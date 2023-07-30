import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest("http://localhost:9090/api/carts");


describe('Test router Cart', function () {

    before(function () {
        this.cartId = null;
        this.productIdInCart = null;
    });

    it('Se debe crear un cart', async function () {
        const { statusCode, body } = await requester.post('/');
        expect(statusCode).to.be.ok;
        expect(body).to.have.a.property('_id');
         // Capturar el ID del carrito creado
        this.cartId = body._id;
        console.log('Carrito creado con ID:', this.cartId);
    });
  

});


