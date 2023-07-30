
import chai from 'chai';
import supertest from 'supertest';
const expect = chai.expect;
const requester = supertest('http://localhost:9090/api/products');

describe('Tests router Product', async function () {

    before(function () {
        this.productId = null;
    });

    it('Debe devolver todos los productos', async function () {
        const { statusCode, body } = await requester.get('/');
        expect(statusCode).to.be.ok;
    });

    it('Debe crear un producto', async function () {

        const product = {
          "code": "c1c1333a",
          "title": "c1c1333a",
          "description":"libro",
          "price": 13000,
          "thumbnail":"sdfsdfdsf",
          "stock": 50,
          "category": "terror",
          "status": true,
        };
        const { statusCode, body } = await requester.post('/').send(product);
    this.productId = body._id;
    console.log('Producto Agregado:', body);
    expect(statusCode).to.be.equal(201);
    expect(body).to.be.an('object').and.have.property('_id');
  });

  it('Debe eliminar el producto', async function () {

    const { statusCode, body } = await requester.delete(`/${this.productId}`);

    expect(statusCode).to.be.ok;
});


});







