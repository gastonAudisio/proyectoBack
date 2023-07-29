import chai from 'chai';
import supertest from 'supertest';


const expect = chai.expect;
const requester = supertest("http://localhost:9090");

describe('Product API', () => {
  // Test para la ruta GET /api/products
describe('GET /api/products', () => {
    it('Debería devolver todos los productos', (done) => {
    requester
        .get('/api/products')
        .end((err, res) => {
        console.log(res.body);
        expect(res.status).to.eql(200); 
        expect(res.body).to.be.an('array');
        

        done();

        });
        
    }).timeout(5000); 
});
});

    //     // Test 01
    //     it("Crear un producto: El API POST /api/products debe crear un nuevo producto correctamente.", async () => {

    //         // Given
    //         const productMock = {
    //             code: "afgo11",
    //             title: "chanchann",
    //             description:"libro",
    //             price: 13000,
    //             thumbnail:"sdfsdfdsf",
    //             stock: 50,
    //             category: "accion",
    //             status: true,
    //         }


    //         // Then
    //         // const { _body, ok, statusCode } = await requester.post("/api/products").send(productMock);
    //         const result = await requester.post("/api/products").send(productMock);
    //         console.log(result);


    //         // Assert that
    //         // expect(statusCode).is.eqls(201);
    //         // expect(_body.payload).is.ok.and.to.have.property('_id');
    //         // expect(res).to.be.json;
    //         // expect(res.body).to.be.an('object');
    //         // expect(res.body).to.have.property('code', nuevoProducto.code);
    //         // expect(res.body).to.have.property('title', nuevoProducto.title);
    //         // expect(res.body).to.have.property('description', nuevoProducto.description);
    //         // expect(res.body).to.have.property('price', nuevoProducto.price);
    //         // expect(res.body).to.have.property('stock', nuevoProducto.stock);
    //         // expect(res.body).to.have.property('category', nuevoProducto.category);
    //         // expect(res.body).to.have.property('status', nuevoProducto.status);
    // });
