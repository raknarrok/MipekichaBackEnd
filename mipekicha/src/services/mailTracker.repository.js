class MailTracker {
    constructor (dao) {
        this.dao = dao
    }

    addMailTracker = async (data) => { return await this.dao.createMailTracker(data) }
    verifyToken = async (data) => { return await this.dao.verifyToken(data) }
    verifyPassword = async (data) => { return await this.dao.verifyPassword(data) }
}

export default MailTracker