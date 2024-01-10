import mongoose from 'mongoose'
import { config } from 'dotenv'
import { logger } from '../middlewares/logger.js'
config()

class MongoSingleton {

    static #instance

    constructor() {
        mongoose.connect(`mongodb+srv://${process.env.APP_MONGO_USER}:${process.env.APP_MONGO_PASSWORD}@${process.env.APP_CLUSTER}.sl91xow.mongodb.net/${process.env.APP_DNNAME}?retryWrites=true&w=majority`, {
            dbName: process.env.APP_DNNAME
        })
            .then(() => logger.debug('Connect to the database'))
            .catch(err => logger.error(err))
    }

    static getInstance() {

        if (this.#instance) {
            logger.debug('DB already exists')
            return this.#instance
        }

        this.#instance = new MongoSingleton()

        return this.#instance
    }
}

export default MongoSingleton