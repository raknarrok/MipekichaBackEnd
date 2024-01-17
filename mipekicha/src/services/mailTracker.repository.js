class MailTracker {
    constructor (dao) {
        this.dao = dao
    }

    addMailTracker = async (data) => { return await this.dao.createMailTracker(data) }
}

export default MailTracker