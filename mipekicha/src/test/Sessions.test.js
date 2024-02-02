import * as chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Test Sessions Endpoints', () => {

    before(async function (done) {
        console.log('Before execution')
        done()
    })

    after(async function (done) {
        console.log('After execution')
        done()
    })

    it('1 Test GET all sessions', async () => {
        const res = await requester.get('/api/session/current')
        const { status, body } = res

        expect(status).to.equal(200)
        expect(body).to.have.property('sessionsData')
    })

    it('2 Update password with unmatch fields', async () => {
        const bodyRequest = {
            token: 'token',
            password: 'randomPassword',
            confirmPassword: 'wrongPassword'
        }
        const res = await requester.post('/api/session/restore').send(bodyRequest)
        const { status, body } = res

        expect(status).to.equal(400)
        expect(body).to.have.property('error', 'Passwords do not match')
    })

    it('3 Update password with invalid token', async () => {
        const bodyRequest = {
            token: 'token',
            password: 'randomPassword',
            confirmPassword: 'randomPassword'
        }
        const res = await requester.post('/api/session/restore').send(bodyRequest)
        const { status, body } = res

        expect(status).to.equal(400)
        expect(body).to.have.property('error', 'Invalid Token')
    })
})