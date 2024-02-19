class UserRepository {

    constructor(dao) {
        this.dao = dao
    }

    changeUserRole = async (uid, data) => { return await this.dao.updateUserRole(uid, data) }

}

export default UserRepository