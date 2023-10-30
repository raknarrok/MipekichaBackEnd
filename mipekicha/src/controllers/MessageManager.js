import fs from 'fs'
import messageModel from '../models/message.model.js'

class MessageManager {
    constructor() {
    }

    async addMessage( message ) {

        messageModel.create({ message })
    }
}

export default MessageManager