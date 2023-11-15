import messageModel from '../models/message.model.js'

class MessageManager {
    constructor() {
    }

    async addMessage( { user, message } ) {
        const newMessage = {
            user,
            message,
        }
        messageModel.create(newMessage)
    }
}

export default MessageManager