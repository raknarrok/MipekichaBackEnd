import ProductModel from '../mongo/models/product.model.js'
import { generateProduct } from '../../utils.js'
import CustomError from '../../services/errors/custom_errors.js'
import { generateProductErrorInfo } from '../../services/errors/info.js'
import EErrors from '../../services/errors/enums.js'

class Product {
    // CRUD - Create Read Update Delete
    createProduct = async ({
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        category,
        statusItem = true, // set default value here
    }) => {
        try {
        const product = {
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            category,
            statusItem,
        }
            if (
                !product?.title ||
                !product?.description ||
                !product?.price ||
                !product?.code ||
                product?.stock === undefined ||
                !product?.category ||
                !product?.statusItem
            ) {
                CustomError.createError({
                    name: 'Error',
                    cause: generateProductErrorInfo(product), // pass product directly
                    message: 'Error trying to create a new product.',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            const isCodeInUse = await ProductModel.exists({ code: product.code })
            if (isCodeInUse) {
                throw new Error(
                    `The code ${product.code} is already in use. Code must be unique.`
                )
            }

            await ProductModel.create(product)

            return product
        }  catch (error) {
            console.error(error)
            throw error
        }
    }

    createMockingProducts = async () => {

        // Product Array
        let productsAdded = []

        for (let indexCounter = 0; indexCounter < 10; indexCounter++) {
            let product = generateProduct()
            const isCodeInUse = await ProductModel.exists({ code: product.code })
            if (isCodeInUse) {
                continue
            }

            await ProductModel.create(product)
            productsAdded.push(product)
        }

        return productsAdded
    }

    updateProduct = async (pid, data) => {
        if (!data) {
            throw new Error(
                'BAD REQUEST: Hey!!! You are missing one or more required fields. Please provide values for title, description, price, code, stock, category or statusItem to continue.'
            )
        }

        const code = data.code
        console.log('Code to be validate', code)
        const isCodeInUse = await ProductModel.exists({ code: code })
        console.log('isCodeInUse', isCodeInUse)
        if (isCodeInUse) {
            throw new Error(
                `The code ${code} is already in use Code must be unique.`
            )
        }

        const updateProduct = await ProductModel.findByIdAndUpdate(
            pid,
            data,
            { new: true }
        )

        return updateProduct
    }

    deleteProductById = async (pid) => {
        return await ProductModel.findByIdAndDelete({ _id: pid })
    }

    deleteProductByCode = async (pcode) => {
        return await ProductModel.deleteOne({ code: pcode })
    }

    getAllProducts = async () => {
        return await ProductModel.find().lean().exec()
    }

    getProductById = async (pid) => {
        return await ProductModel.findById(pid).lean().exec()
    }

    getProductByCode = async (pcode) => {
        return await ProductModel.findOne({ code: pcode }).lean().exec()
    }
}

export default Product