import CartDTO from '../dao/DTO/cart.dto.js'

class CartRepository {

    constructor (dao) {
        this.dao = dao
    }

    addCart = async () => { return await this.dao.createCart() }
    // TODO: HOW TO IMPLEMENT THIS?
    addProduct = async(cid, pid, data) => { return await this.dao.addProductToCart(cid, pid, data)}
    removeCart = async(cid) => { return await this.dao.deleteCart(cid) }
    removeProduct = async(cid, pid) => { return await this.dao.deleteProduct(cid, pid) }
    removeAllProducts = async(cid) => { return await this.dao.deleteAllProducts(cid) }
    retrieveAllCarts = async() => { return await this.dao.getAllCarts() }
    retrieveCartById = async(cid) => { return await this.dao.getCartById(cid) }
}

export default CartRepository