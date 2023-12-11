import { productService } from '../../services/index.js'

export const addProduct = async (req, res) => {

    const data = req.body
    const result = await productService.addProduct(data)

    res.send({
        status: 'success',
        payload: result
    })
}

export const updateProduct = async (req, res) => {

    const pid = req.params.pid
    const data = req.body
    const result = await productService.updateProduct(pid, data)

    res.send({
        status: 'success',
        payload: result
    })
}

export const removeProductById = async (req,res) => {

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

export const retrieveAllProducts = async (req, res) => {

    const result = await productService.retrieveAllProducts()
    console.log('Products from controller', result)
    res.send({
        status: 'success',
        payload: result
    })
}

export const retrieveProductById = async (req, res) => {

    const pid = req.params.pid
    const result = await productService.retrieveProductById(pid)

    res.send({
        status: 'success',
        payload: result
    })
}

export const retrieveProductByCode = async (req, res) => {

    const pcode = req.params.pcode
    const result = await productService.retrieveProductByCode(pcode)

    res.send({
        status: 'success',
        payload: result
    })
}