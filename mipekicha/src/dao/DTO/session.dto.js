class SessionDTO {

    constructor(session) {
        const sessionData = JSON.parse(session.session)

        this.user = {
            first_name: sessionData.user?.first_name,
            last_name: sessionData.user?.last_name,
            email: sessionData.user?.email,
            age: sessionData.user?.age,
            role: sessionData.user?.role
        };
    }
}

export default SessionDTO