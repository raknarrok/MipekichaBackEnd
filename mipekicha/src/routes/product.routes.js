import { Router } from 'express'
import { addProduct, updateProduct, removeProductById, removeProductByCode, retrieveAllProducts, retrieveProductById, retrieveProductByCode, addMockingProducts } from '../dao/controllers/product.controller.js'

const route = Router()

// ESTAS RUTAS VAN A ESTAR PRECEDIDAS POR /api/products
// ESTO LO DEFINIMOS EN APP EN LA LINEA 26

route.post('/', addProduct)
route.put('/:pid', updateProduct)
route.delete('/:pid', removeProductById)
route.delete('/code/:pcode', removeProductByCode)
route.get('/', retrieveAllProducts)
route.get('/:pid', retrieveProductById)
route.get('/code/:pcode', retrieveProductByCode)
route.post('/mockingproducts', addMockingProducts)

export default route