class UserRepository {

    constructor(dao) {
        this.dao = dao
    }

    changeUserRole = async (uid, data) => { return await this.dao.updateUserRole(uid, data) }
    retrieveAllUsers = async () => { return await this.dao.getAllUsers() }
    retrieveUserById = async (uid) => { return await this.dao.getUserById(uid) }
    retrieveUserByEmail = async (email) => { return this.dao.getUserByEmail(email) }

}

export default UserRepository