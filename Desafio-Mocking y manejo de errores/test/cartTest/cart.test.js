import chai from 'chai';
import chaiHttp from 'chai-http';
import app from "../../src/app.js";

const expect = chai.expect;
chai.use(chaiHttp);

describe('Product API', () => {
  // Test para la ruta GET /api/carts
  describe('GET /api/carts', () => {
    
    it('Debería devolver todos los carts', (done) => {
      chai
        .request(app)
        .get('/api/carts')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          done();
        });
    }).timeout(5000); 
  });
});