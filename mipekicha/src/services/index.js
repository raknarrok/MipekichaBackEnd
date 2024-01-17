import { Cart, Product, Ticket, MailTracker } from '../dao/factory.js'
import CartRepository from './cart.repository.js'
import ProductRepository from './product.repository.js'
import TicketRepository from './ticket.repository.js'
import MailRespository from './mailTracker.repository.js'

export const cartService = new CartRepository(new Cart())
export const productService = new ProductRepository(new Product())
export const ticketService = new TicketRepository(new Ticket())
export const mailTrackerService = new MailRespository(new MailTracker())