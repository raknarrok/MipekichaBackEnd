import * as chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Test Products Endpoints', () => {

    before(async function (done) {
        console.log('Before execution')
        done()
    })

    after(async function (done) {
        console.log('After execution')
        done()
    })

    it('1 Test GET all products', async () => {
        const res = await requester.get('/api/products')
        const { status, body } = res

        console.log('Current response details -> ', { status, body })
        expect(status).to.equal(200)
        expect(body).to.have.property('status', 'success')
        expect(body).to.have.property('payload')
    })

    it('2 Test POST product with empty body', async () => {
        const res = await requester.post('/api/products').send()
        const { status, body } = res
        const expectedError = '\n    Some values are missing or invalid\n    - Title: undefined\n    - Description: undefined\n    - Price: undefined\n    - Code: undefined\n    - Stock: undefined\n    - Category: undefined\n    - StatusItem: true\n    '

        expect(status).to.equal(400)
        expect(body).to.have.property('status', 'error')
        expect(body).to.have.property('error', 'Error')
        expect(body).to.have.property('cause', expectedError)
    })

    it('3 Test GET existing product by ID', async () => {
        const productId = '6544fde3f6517a8288d78816'
        const res = await requester.get(`/api/products/${productId}`)
        const { status, body } = res

        expect(status).to.equal(200)
        expect(body).to.have.property('status', 'success')
        expect(body.payload).to.have.property('_id', `${productId}`)
    })

    it('4 Test GET non existing product by ID', async () => {
        const productId = '6544fde3f6517a8288d78817'
        const res = await requester.get(`/api/products/${productId}`)
        const { status, body } = res

        expect(status).to.equal(200)
        expect(body).to.have.property('status', 'success')
        expect(body).to.have.property('payload', null)
    })
})