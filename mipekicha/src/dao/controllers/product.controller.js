import { productService } from '../../services/index.js'
// TODO: Implement Try/Catch
export const addProduct = async (req, res, next) => {

    try {
        const data = req.body
        const result = await productService.addProduct(data)

        res.send({
            status: 'success',
            payload: result
        })
    }
    catch (error) {
        next(error)
    }
}

export const addMockingProducts = async (req, res, next) => {

    try {
        const result = await productService.addMockingProducts()

        res.send({
            status: 'success',
            payload: result
        })
    }
    catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {

    try {
        const pid = req.params.pid
        const data = req.body
        const result = await productService.updateProduct(pid, data)

        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        next(error)
    }
}

export const removeProductById = async (req, res) => {

    const pid = req.params.pid
    const result = await productService.removeProductById(pid)

    res.send({
        status: 'success',
        payload: result
    })
}

export const removeProductByCode = async (req, res) => {

    const pcode = req.params.pcode
    const result = await productService.removeProductByCode(pcode)

    res.send({
        status: 'success',
        payload: result
    })
}

export const retrieveAllProducts = async (req, res, next) => {

    try {
        const result = await productService.retrieveAllProducts()
        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        next(error)
    }
}

export const retrieveProductById = async (req, res, next) => {

    try {
        const pid = req.params.pid
        const result = await productService.retrieveProductById(pid)

        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        next(error)
    }
}

export const retrieveProductByCode = async (req, res) => {

    const pcode = req.params.pcode
    const result = await productService.retrieveProductByCode(pcode)

    res.send({
        status: 'success',
        payload: result
    })
}