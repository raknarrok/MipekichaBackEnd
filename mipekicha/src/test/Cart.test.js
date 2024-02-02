import * as chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect // Chai is more used on the community
const requester = supertest('http://localhost:8080')

describe('Test Cart Endpoints', () => {

  before(async function (done) {
    console.log('Before execution')
    done()
  })

  after(async function (done) {
    console.log('After execution')
    done()
  })

  it('1 Test GET all carts', async () => {
    const res = await requester.get('/api/cart')
    const { status, body } = res

    expect(status).to.equal(200)
    expect(body).to.have.property('status', 'success')
    expect(body).to.have.property('payload')
  })

  it('2 Test POST new cart', async () => {
    const res = await requester.post('/api/cart').send()
    const { status, body } = res

    expect(status).to.equal(200)
    expect(body).to.have.property('status', 'success')
    expect(body).to.have.property('payload')
    expect(body.payload).to.have.property('products').that.is.an('array').that.is.empty
    expect(body.payload).to.have.property('_id')
  })

  it('3 Test GET cart by ID', async () => {
    const res = await requester.post('/api/cart').send()
    const { status, body } = res

    expect(status).to.equal(200)

    const _id = body.payload._id

    const getCartById = await requester.get(`/api/cart/${_id}`)
    const { status: statusGet, body: bodyGet } = getCartById

    expect(statusGet).to.equal(200)
    expect(bodyGet).to.have.property('status', 'success')
    expect(bodyGet.payload).to.have.property('_id', `${_id}`)
  })

  it('4 Test PUT product into cart', async () => {
    const res = await requester.post('/api/cart').send()
    const { status, body } = res

    expect(status).to.equal(200)

    const _id = body.payload._id

    let productDetails = {
      "products": [
        {
          "quantity": 2
        }
      ]
    }

    const productId = '6544fde3f6517a8288d78816'
    const putProduct = await requester.put(`/api/cart/${_id}/product/${productId}`).send(productDetails)
    const { status: statusPut, body: bodyPut } = putProduct

    expect(statusPut).to.equal(200)
    expect(bodyPut).to.have.property('status', 'success')
    expect(bodyPut).to.have.property('payload')
    expect(bodyPut.payload).to.have.property('acknowledged',true)
    expect(bodyPut.payload).to.have.property('modifiedCount',1)
  })

  it('5 Test DELETE a product from cart with multiple products', async () => {

    const reqCart = await requester.post('/api/cart').send()
    const { status, body } = reqCart

    expect(status).to.equal(200)

    const cartId = body.payload._id

    let productDetails = {
      "products": [
        {
          "quantity": 2
        }
      ]
    }

    const productId = '6544fde3f6517a8288d78816'
    const reqProduct = await requester.put(`/api/cart/${cartId}/product/${productId}`).send(productDetails)
    const { status: statusPut, body: bodyPut } = reqProduct

    expect(statusPut).to.equal(200)

    const secondProductId = '654559c87175a6d0ec58cd5a'
    const reqSecondProduct = await requester.put(`/api/cart/${cartId}/product/${secondProductId}`).send(productDetails)
    const { status: statusSecondPut, body: bodySecondPut } = reqSecondProduct

    expect(statusSecondPut).to.equal(200)

    const getCartById = await requester.get(`/api/cart/${cartId}`)
    const { status: statusGet, body: bodyGet } = getCartById

    expect(statusGet).to.equal(200)
    expect(bodyGet).to.have.property('status', 'success')
    expect(bodyGet.payload).to.have.property('_id', `${cartId}`)
    expect(bodyGet.payload).to.have.property('products').that.is.an('array').with.lengthOf(2)

    const deleteProduct = await requester.delete(`/api/cart/${cartId}/products/${productId}`)
    const { status: statusDelete, body: bodyDelete } = deleteProduct

    expect(statusDelete).to.equal(200)
    expect(bodyDelete).to.have.property('status', 'success')
    expect(bodyDelete).to.have.property('payload')
    expect(bodyDelete.payload.products[0]).to.have.property('product',secondProductId)
    expect(bodyDelete.payload).to.have.property('products').that.is.an('array').with.lengthOf(1)
  })
})