/*
Go to cd src
Run node app.js
*/
const fs = require('fs')

class ProductManager {
  constructor (filePath) {
    this.productIdCounter = 1
    this.filePath = filePath
    this.products = this.checkFile()
  }

  addProduct ({ title, description, price, thumbnail, code, stock, category, statusItem }) {
    // First Validate if we have all the required fields
    if (!title || !description || !price || !code || stock === undefined || !category || !statusItem) {
      throw new Error('BAD REQUEST: Hey!!! You are missing one or more required fields. Please provide values for title, description, price, code, stock, category or statusItem to continue.')
    }

    const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0)
    this.productIdCounter = maxId + 1

    // Read the file and parse the content to an array
    const fileContent = this.checkFile()

    // Verify if the file is empty.
    if (fileContent) {
      // Verify if the code is already in use
      const isCodeInUse = this.products.some((product) => product.code === code)
      if (isCodeInUse) {
        throw new Error(`The code ${code} is already in use Code must be unique.`)
      }

      const product = {
        id: this.productIdCounter,
        title,
        description,
        price,
        thumbnail,
        code: code || `P${this.productIdCounter}`,
        stock,
        category,
        statusItem: statusItem || true
      }
      this.products.push(product)
      this.saveFile()
      this.productIdCounter++
    } else {
      // If the file is empty, create an array with the first product
      const product = {
        id: this.productIdCounter,
        title,
        description,
        price,
        thumbnail,
        code: code || `P${this.productIdCounter}`,
        stock,
        category,
        statusItem: statusItem || true
      }
      this.products.push(product)
      this.saveFile()
      this.productIdCounter++
    }
  }

  removeProductByCode (code) {
    const index = this.products.findIndex((product) => product.code === code)
    if (index !== -1) {
      this.products.splice(index, 1)
      this.saveFile()
    } else {
      throw new Error(`The code ${code} doesnt exist, please verify and try again.`)
    }
  }

  removeProductById (id) {
    const index = this.products.findIndex((product) => product.id === id)
    if (index !== -1) {
      this.products.splice(index, 1)
      this.saveFile()
    } else {
      throw new Error(`The id ${id} doesnt exist, please verify and try again.`)
    }
  }

  removeProduct (product) {
    this.removeProductByCode(product.code)
  }

  getProductByCode (code) {
    const product = this.products.find((product) => product.code === code)
    if (!product) {
      throw new Error(`The code ${code} doesnt exist, please verify and try again.`)
    }
    return product
  }

  getProductById (id) {
    const product = this.products.find((product) => product.id === id)
    if (!product) {
      return 0
    }
    return product
  }

  updateProductByCode (code, updatedProduct) {
    const index = this.products.findIndex((product) => product.code === code)
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct }
      this.saveFile()
    }
  }

  updateProductById (id, updatedProduct) {
    const { code } = updatedProduct
    const isCodeInUse = this.products.some((product) => product.code === code)
    if (isCodeInUse) {
      throw new Error(`The code ${code} is already in use Code must be unique.`)
    }

    const index = this.products.findIndex((product) => product.id === id)
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct }
      this.saveFile()
    } else {
      throw new Error(`The id ${id} doesnt exist, please verify and try again.`)
    }
  }

  updateProductList (newProductList) {
    this.products = newProductList
  }

  getAllProducts () {
    return this.products || []
  }

  getProducts (limit) {
    if (!limit) {
      return this.products
    } else {
      // throw new Error('NOT FOUND: No existen productos para mostrar.')
      return this.products.slice(0, limit)
    }
  }

  checkFile () {
    try {
      // Read the file and parse the content to an array
      const fileContent = fs.readFileSync(this.filePath, 'utf8')
      // Verify if the file is empty.
      if (!fileContent) {
        return []
      }
      return JSON.parse(fileContent) || []
    } catch (error) {
      console.error(error)
      return []
    }
  }

  saveFile () {
    fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2))
  }
}

const listElements = new ProductManager('./products.txt')

// Products Creation Section
const productOne = {
  title: 'Collar Slim',
  description: '½ pulgada de ancho Nombre y 1 numero de tel bordado',
  price: 100,
  thumbnail: 'https://raknarrok.github.io/static/images/productos/collares/slim.png',
  code: 'CXS',
  stock: 10,
  category: 'Collares',
  statusItem: true
}

const productTwo = {
  title: 'Collar Normal',
  description: '1 pulgada de ancho Nombre y 1 numero de tel bordado',
  price: 200,
  thumbnail: 'https://raknarrok.github.io/static/images/productos/collares/normal.png',
  code: 'CN',
  stock: 10,
  category: 'Collares',
  statusItem: true
}

const productThree = {
  title: 'Collar Ancho',
  description: '1 ½ pulgada de ancho Nombre y 1 numero de tel bordado',
  price: 200,
  thumbnail: 'https://raknarrok.github.io/static/images/productos/collares/ancho.png',
  code: 'CA',
  stock: 30,
  category: 'Collares',
  statusItem: true
}

const productFour = {
  title: 'Collar Especial',
  description: 'Diferentes anchos, colores y diseños. Nombre y 1 numero de tel bordado',
  price: 450,
  thumbnail: 'https://raknarrok.github.io/static/images/productos/collares/ancho.png',
  code: 'CE',
  stock: 5,
  category: 'Collares',
  statusItem: true
}

const productFive = {
  title: 'Plaquita Hueso S',
  description: 'Plaquita de hueso de 1.5 cm de ancho por 1 cm de alto. Nombre y 1 numero de tel bordado',
  price: 450,
  thumbnail: 'https://raknarrok.github.io/static/images/productos/collares/ancho.png',
  code: 'PHS',
  stock: 5,
  category: 'Plaquitas',
  statusItem: true
}

const productSix = {
  title: 'Dog Tag Type 1',
  description: 'This is a dog tag type 1',
  price: 9.99,
  thumbnail: 'https://example.com/dogtag1.jpg',
  code: 'DT1',
  stock: 15,
  category: 'Plaquitas',
  statusItem: true
}

const productSeven = {
  title: 'Dog Tag Type 2',
  description: 'This is a dog tag type 2',
  price: 12.99,
  thumbnail: 'https://example.com/dogtag2.jpg',
  code: 'DT2',
  stock: 8,
  category: 'Plaquitas',
  statusItem: true
}

const productEight = {
  title: 'Dog Tag Type 3',
  description: 'This is a dog tag type 3',
  price: 14.99,
  thumbnail: 'https://example.com/dogtag3.jpg',
  code: 'DT3',
  stock: 3,
  category: 'Plaquitas',
  statusItem: true
}

const productNine = {
  title: 'Dog Tag Type 4',
  description: 'This is a dog tag type 4',
  price: 8.99,
  thumbnail: 'https://example.com/dogtag4.jpg',
  code: 'DT4',
  stock: 20,
  category: 'Plaquitas',
  statusItem: true
}

const productTen = {
  title: 'Dog Tag Type 5',
  description: 'This is a dog tag type 5',
  price: 11.99,
  thumbnail: 'https://example.com/dogtag5.jpg',
  code: 'DT5',
  stock: 12,
  category: 'Plaquitas',
  statusItem: true
}

// Verify list is empty
console.log('------Empty Array Is displayed', listElements.getAllProducts())

// Adding products
/*
listElements.addProduct(productOne)
listElements.addProduct(productTwo)
listElements.addProduct(productThree)
listElements.addProduct(productFour)
listElements.addProduct(productFive)
listElements.addProduct(productSix)
listElements.addProduct(productSeven)
listElements.addProduct(productEight)
listElements.addProduct(productNine)
listElements.addProduct(productTen)
*/

module.exports = ProductManager
