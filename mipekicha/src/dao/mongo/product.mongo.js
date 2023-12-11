import ProductModel from '../mongo/models/product.model.js'

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
        statusItem,
    }) => {
        // First Validate if we have all the required fields
        if (
            !title ||
            !description ||
            !price ||
            !code ||
            stock === undefined ||
            !category ||
            !statusItem
        ) {
            throw new Error(
                'BAD REQUEST: Hey!!! You are missing one or more required fields. Please provide values for title, description, price, code, stock, category or statusItem to continue.'
            )
        }

        const product = {
            title,
            description,
            price,
            thumbnails,
            code: code,
            stock,
            category,
            statusItem: statusItem || true,
        }

        const isCodeInUse = await ProductModel.exists({ code: code })
        if (isCodeInUse) {
            throw new Error(
                `The code ${code} is already in use Code must be unique.`
            )
        }

        await ProductModel.create(product)

        return product
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
        return  await ProductModel.find().lean().exec()
    }

    getProductById = async (pid) => {
        return await ProductModel.findById(pid).lean().exec()
    }

    getProductByCode = async (pcode) => {
        return await ProductModel.findOne({ code: pcode }).lean().exec()
    }
}

export default Product