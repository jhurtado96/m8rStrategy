const app = require('../server')
const request = require('supertest')


describe("GET /", () => {
    it('Lista de clientes', done => {
        request(app)
            .get('/clientes')
            .set('Accept', 'application/json')
            .expect(200, done)
    })

    it('Lista de envios', done => {
        request(app)
            .get('/envios')
            .set('Accept', 'application/json')
            .expect(200, done)
    })

})
describe("POST /", () => {
    it('login', done => {
        request(app)
            .post('/login')
            .set('Accept', 'application/json')
            .expect(200, done)
    })
})