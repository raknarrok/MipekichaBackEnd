class CartDTO {
    constructor(cart) {
        this.product = cart?.product ?? []
        this.quantity = cart?.quantity ?? 0
    }
}

export default CartDTO