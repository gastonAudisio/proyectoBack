import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest("http://localhost:9090/api/carts");


describe('Test router Cart', function () {
    before(function () {
        this.cartId = null;
        this.productIDInCart = null;
    });
    it('Debe crear un cart', async function () {
        const { statusCode, body } = await requester.post('/');
        expect(statusCode).to.be.ok;
        expect(body).to.have.a.property('_id');
        this.cartId = body._id;
        console.log('Carrito creado con ID:', this.cartId);
    });

    // it('Debe eliminar el cart', async function () {
    //     const { statusCode, body } = await requester.delete('/');
    //     expect(statusCode).to.be.ok;
    // });


    it('Debe agregar un producto al cart', async function () {
        // Crear un producto y obtener su ID
        const product = {
            "code": "lopñ",
            "title": "lopñ",
            "description": "libro",
            "price": 13000,
            "thumbnail": "sdfsdfdsf",
            "stock": 50,
            "category": "terror",
            "status": true,
        };
        const { body: { _id: productID } } = await requester.post('/').send(product);

        this.productIDInCart = productID;

        // Agregar el producto al carrito usando los IDs reales
        const { statusCode, body } = await requester.post(`/${this.cartId}/products/${productID}`);

        expect(statusCode).to.be.ok;
    });
});


