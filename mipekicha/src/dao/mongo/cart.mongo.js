import CartModel from '../models/cart.model.js'

class Cart {

    createCart = async () => {
        const cart = {
            products: []
        }
        return await CartModel.create(cart)
    }

    addProductToCart = async (cid, pid, data) => {

        const cart = await CartModel.findById(cid).lean().exec()

        if (!cart) {
            throw new Error(`The cart with id ${cid} was not found.`)
        }

        const stringProductId = pid.toString()

        // Verify if the product is already in the cart
        const isProductInCart = cart.products.some((products) => products.product.toString() === stringProductId)

        if (isProductInCart) {
            // If is in the cart, update the quantity
            return await CartModel.updateOne({ _id: cid, 'products.product': stringProductId }, { $inc: { 'products.$.quantity': data.products[0].quantity } })
        } else {
            return await CartModel.updateOne(
                { _id: cid },
                {
                    $push: {
                        products:
                            { product: pid, quantity: data.products[0].quantity }
                    }
                }
            )
        }
    }

    deleteCart = async (cid) => {
        return await CartModel.deleteOne({ _id: cid })
    }

    deleteProduct = async (cid, pid) => {
        return await CartModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        )
    }

    deleteAllProducts = async (cid) => {
        const resetCart = { products: [] }
        return await CartModel.findByIdAndUpdate(
            { _id: cid }, resetCart, { new: true }
        )
    }

    getAllCarts = async () => {
        return await CartModel.find().lean().exec()
    }

    getCartById = async (cid) => {
        return await CartModel.findOne({ _id: cid }).populate('products.product').lean().exec()
    }
}

export default Cart