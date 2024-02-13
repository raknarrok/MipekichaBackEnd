import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'
import { dirname } from 'path'
import { faker } from '@faker-js/faker'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const generateProduct = () => {

    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnails: faker.image.url(),
        code: faker.string.alphanumeric({ length: { min: 7, max: 15 } }),
        stock: faker.number.int({ min: 10, max: 100 }),
        category: faker.commerce.department(),
        owner: faker.string.uuid(),
        statusItem: faker.datatype.boolean()
    }
}

export const helpers = {
    eq: (val1, val2) => {

        if (val1 === undefined || val2 === undefined) {
            console.error('Both values must be defined');
            return false;
        }

        return JSON.stringify(val1) === JSON.stringify(val2)
    }
}