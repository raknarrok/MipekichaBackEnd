import { Cart, Product, Ticket } from '../dao/factory.js'
import CartRepository from './cart.repository.js'
import ProductRepository from './product.repository.js'
import TicketRepository from './ticket.repository.js'

export const cartService = new CartRepository(new Cart())
export const productService = new ProductRepository(new Product())
export const ticketService = new TicketRepository(new Ticket())