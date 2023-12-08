import CartsModel from '../models/cart.model.js'

class CartsServices {
    constructor() {}

    getAll = async () => {
        return await CartsModel.find().lean().exec()
    }
}

export default CartsServices