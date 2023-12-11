import sessionModel from '../mongo/models/sessions.model.js'

class SessionManager {
    constructor() {
        this.sessions = this.checkDb()
    }

    // Get All Sessions
    async getAllSessions(){
        return await this.checkDb()
    }

    async checkDb() {
        try {
          // Read the file and parse the content to an array
          const documentContent = await sessionModel.find().lean().exec()
          // Verify if the file is empty.
          if (!documentContent) {
            return []
          }
          return documentContent || []
        } catch (error) {
          console.error(error)
          return []
        }
      }
}

export default SessionManager