export default class UserDTO {

    constructor(user){
        this.first_name = user?.first_name ?? ''
        this.last_name = user?.last_name ?? ''
        this.email = user?.email ?? ''
        this.age = user?.age ?? 0
        this.cart = user?.cart ?? ''
        this.role = user?.role ?? 'user'
    }
}