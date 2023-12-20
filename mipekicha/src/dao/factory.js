import { config } from 'dotenv'
import MongoSingleton from '../database/MongoSingleton.js'
config()

export let Cart
export let Product
export let Ticket

console.log(`Persistence with ${ process.env.PERSISTENCE_TYPE }`)

switch (process.env.PERSISTENCE_TYPE) {
    case 'MONGO':
        const mongoInstance = MongoSingleton.getInstance()
        const { default: CartMongo } =  await import ('./mongo/cart.mongo.js')
        const { default: ProductMongo } = await import ('./mongo/product.mongo.js')
        const { default: TicketMongo } = await import ('./mongo/ticket.mongo.js')

        Cart = CartMongo
        Product = ProductMongo
        Ticket = TicketMongo
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