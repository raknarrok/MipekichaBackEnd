import { config } from 'dotenv'
import MongoSingleton from '../database/MongoSingleton.js'
import { logger } from '../middlewares/logger.js'
config()

export let Cart
export let Product
export let Ticket

logger.debug(`Persistence with ${ process.env.PERSISTENCE_TYPE }`)

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
        logger.debug('TODO: FILE')
        break
    case 'MYSQL':
        logger.debug('TODO: POSTGRESQL')
        break
    case 'POSTGRESQL':
        logger.debug('TODO: POSTGRESQL')
        break
    default:
        throw new Error('No persistence selected')
}