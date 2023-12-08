import { config } from 'dotenv'
import MongoSingleton from '../database/MongoSingleton.js'
config()

export let Cart

console.log(`Persistence with ${ process.env.PERSISTENCE_TYPE }`)

switch (process.env.PERSISTENCE_TYPE) {
    case 'MONGO':
        const mongoInstance = MongoSingleton.getInstance()
        const { default: CartMongo } =  await import ('./mongo/cart.mongo.js')

        Cart = CartMongo
        // product
        // user
        // message ??
        // sessions ??
        break
    case 'FILE':
        console.log('TODO: FILE')
        break
    case 'MYSQL':
        console.log('TODO: POSTGRESQL')
        break
    case 'POSTGRESQL':
        console.log('TODO: POSTGRESQL')
        break
    default:
        throw new Error('No persistence selected')
}