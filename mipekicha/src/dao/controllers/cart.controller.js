// Controller: CartController
import { cartService } from '../../services/index.js'

// POST
export const addCart = async (req, res) => {

    const result = await cartService.addCart()

    res.send({
        status: 'success',
        payload: result
    })
}

export const addProduct = async (req, res) => {

    const { cid, pid } = req.params
    const data = req.body
    const result = await cartService.addProduct(cid, pid, data)

    res.send({
        status: 'success',
        payload: result
    })
}

// DELETE
export const removeProduct = async (req, res) => {

    const { cid, pid } = req.params
    const result = await cartService.removeProduct(cid, pid)

    res.send({
        status: 'success',
        payload: result
    })
}

export const removeAllProducts = async (req, res) => {

    const cid = req.params.cid
    const result = await cartService.removeAllProducts(cid)

    res.send({
        status: 'success',
        payload: result
    })
}

// GET
export const getAll = async(req, res) => {

    const result = await cartService.retrieveAllCarts()

    res.send({
        status: 'success',
        payload: result
    })
}

export const getCartById = async (req, res) => {

    const cid = req.params.cid
    const result = await cartService.retrieveCartById(cid)

    res.send({
        status: 'success',
        payload: result
    })
}