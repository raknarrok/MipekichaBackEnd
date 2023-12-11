import { Cart, Product } from '../dao/factory.js'
import CartRepository from './cart.repository.js'
import ProductRepository from './product.repository.js'

export const cartService = new CartRepository(new Cart())
export const productService = new ProductRepository(new Product())