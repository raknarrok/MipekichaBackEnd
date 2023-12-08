// Controller: CartController
import { cartService } from '../../services/index.js'

export const addCart = async (req, res) => {
    const result = await cartService.addCart()
    res.send({
        status: 'success',
        payload: result
    })
}

export const getAll = async(req, res) => {
    const result = await cartService.retrieveAllCarts()
    res.send({
        status: 'success',
        payload: result
    })
}

/*
import CartService from '../../services/cart.repository.js'

const cartService = new CartService()

export const getAll = async (req, res) => {
    return res.json(await cartService.getAll())
}
*/