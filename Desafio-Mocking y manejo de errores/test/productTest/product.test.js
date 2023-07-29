
import chai from 'chai';
import supertest from 'supertest';
const expect = chai.expect;
const requester = supertest('http://localhost:9090/api/products');

describe('Tests router Product', async function () {

    before(function () {
        this.productId = null;
    });

    it('Devuelve todo los productos y deben tener status 200', async function () {
        const { statusCode, body } = await requester.get('/');
        expect(statusCode).to.be.ok;
    });

    it('Se debe crear un producto y el statuscode debe ser 201', async function () {

        const product = {
          "code": "c1c1",
          "title": "c1c1",
          "description":"libro",
          "price": 13000,
          "thumbnail":"sdfsdfdsf",
          "stock": 50,
          "category": "accion",
          "status": true,
        };
        const { statusCode, body } =
        await requester.post('/').send(product);
    this.productId = body._id;
    console.log('Producto Agregado:', body);
    expect(statusCode).to.be.equal(201);
    expect(body).to.be.an('object').and.have.property('_id');

  });

});







