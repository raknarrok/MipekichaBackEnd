import Router from 'express'
import { addCart, addProduct, getAll, getCartById, removeProduct, removeAllProducts } from '../dao/controllers/cart.controller.js'

const route = Router()

route.post('/', addCart)
route.post('/:cid/product/:pid', addProduct)
route.delete('/:cid/products/:pid', removeProduct)
route.delete('/:cid', removeAllProducts)
route.get('/', getAll)
route.get('/:cid', getCartById)

export default route