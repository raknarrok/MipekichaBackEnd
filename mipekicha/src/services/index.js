import { Cart } from '../dao/factory.js'
import CartRepository from './cart.repository.js'

export const cartService = new CartRepository(new Cart())