// Controller: CartController
import CartService from '../services/cart.service.js'

const cartService = new CartService()

export const getAll = async (req, res) => {
    return res.json(await cartService.getAll())
}