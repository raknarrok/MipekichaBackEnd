import React, { Component } from 'react'

class ProductManager extends Component {
    constructor() {
      super()
      this.products = []
      this.productIdCounter = 1
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
      const product = {
        id: this.productIdCounter,
        title,
        description,
        price,
        thumbnail,
        code: code || `P${this.productIdCounter}`,
        stock,
      }
      this.products.push(product)
      this.productIdCounter++
    }
  
    removeProductByCode(code) {
      const index = this.products.findIndex((product) => product.code === code)
      if (index !== -1) {
        this.products.splice(index, 1)
      }
    }

    removeProduct(product) {
      this.removeProductByCode(product.code);
    }
  
    getProductByCode(code) {
      return this.products.find((product) => product.code === code)
    }
  
    updateProductByCode(code, updatedProduct) {
      const index = this.products.findIndex((product) => product.code === code)
      if (index !== -1) {
        this.products[index] = { ...this.products[index], ...updatedProduct }
      }
    }

    updateProductList(newProductList) {
      this.products = newProductList
    }
  
    getAllProducts() {
      return this.products
    }
  }

  export default ProductManager
  