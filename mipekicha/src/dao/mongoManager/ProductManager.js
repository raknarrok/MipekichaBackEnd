/*
Go to cd src
Run node app.js
*/
import productModel from '../models/product.model.js'

class ProductManager {
  constructor() {
    this.products = this.checkDb()
  }

  // POST
  async addProduct({
    title,
    description,
    price,
    thumbnails,
    code,
    stock,
    category,
    statusItem,
  }) {
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

    // Read the file and parse the content to an array
    const fileContent = this.checkDb()

    const product = {
      // id: this.productIdCounter,
      title,
      description,
      price,
      thumbnails,
      code: code,
      stock,
      category,
      statusItem: statusItem || true,
    }

    // Verify if the file is empty.
    if (fileContent) {
      // Verify if the code is already in use
      const isCodeInUse = await productModel.exists({ code: code })
      if (isCodeInUse) {
        throw new Error(
          `The code ${code} is already in use Code must be unique.`
        )
      }

      await productModel.create(product)
    } else {
      // If the file is empty, create an array with the first product
      await productModel.create(product)
    }

    return product
  }

  // UPDATE
  async updateProductById(id, bodyRequest) {
    // First Validate if we have all the required fields
    if (!bodyRequest) {
      throw new Error(
        'BAD REQUEST: Hey!!! You are missing one or more required fields. Please provide values for title, description, price, code, stock, category or statusItem to continue.'
      )
    }

    // Read the file and parse the content to an array
    const fileContent = this.checkDb()
    const code = bodyRequest.code
    // Verify if the file is empty.
    if (fileContent) {
      // Verify if the code is already in use
      if (code !== undefined) {
        const isCodeInUse = await productModel.exists({ code: code })
        if (isCodeInUse) {
          throw new Error(
            `The code ${code} is already in use Code must be unique.`
          )
        }
      }

      await productModel.findByIdAndUpdate({ _id: id }, bodyRequest, {
        new: true,
      })
    } else {
      // If the file is empty, create an array with the first product
      await productModel.findByIdAndUpdate({ _id: id }, bodyRequest, {
        new: true,
      })
    }
  }

  // DELETE
  async removeProductByCode(code) {
    // Ejecutamos desde mongo el metodo deleteOne, pasandole como parametro el codigo del producto
    try {
      await productModel.deleteOne({ code: code }).exec()
    } catch (error) {
      console.error(error)
    }
  }

  async removeProduct(product) {
    await this.removeProductByCode(product.code)
  }

  async removeProductById(id) {
    // Ejecutamos desde mongo el metodo deleteOne, pasandole como parametro el ID del producto
    try {
      await productModel.findByIdAndDelete({ _id: id }).exec()
    } catch (error) {
      console.error(error)
    }
  }

  // GET
  async getProductById(id) {
    const product = await productModel.findById(id)
    if (!product) {
      return 0
    }
    return product
  }

  async getProductByCode(code) {
    const product = await productModel.findOne({ code: code })
    if (!product) {
      return 0
    }
    return product
  }

  async getAllProducts() {
    return await this.checkDb()
  }

  async getProducts(limit) {
    if (!limit) {
      return await productModel.find().limit(5).lean().exec()
    } else {
      return await productModel.find().limit(limit).lean().exec()
    }
  }

  // General Functions
  async checkDb() {
    try {
      // Read the file and parse the content to an array
      const fileContent = await productModel.find().lean().exec()
      // Verify if the file is empty.
      if (!fileContent) {
        return []
      }
      return fileContent || []
    } catch (error) {
      console.error(error)
      return []
    }
  }
}

export default ProductManager
