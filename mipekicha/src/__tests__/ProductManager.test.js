const ProductManager = require('../ProductManager')
/*
beforeEach(() => {
    productManager = new ProductManager('./products.txt')
  })

  afterEach(() => {
    try {
      fs.unlinkSync('./products.txt')
    } catch (error) {
        console.log(error)
    }
  })
  */

describe('ProductManager', () => {
  it('should add a product', () => {
    const productManager = new ProductManager('./products.txt')
    const product = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 10,
      code: 'TEST1',
      stock: 5,
      category: 'Test',
      statusItem: true
    }
    productManager.addProduct(product)
    const products = productManager.getAllProducts()
    expect(products).toHaveLength(1)
    expect(products[0]).toEqual(expect.objectContaining(product))
    productManager.removeProductByCode('TEST1')
  })
})

describe('ProductManager', () => {
  it('should remove a product', () => {
    const productManager = new ProductManager('./products.txt')
    const product = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 10,
      code: 'TEST2',
      stock: 5,
      category: 'Test',
      statusItem: true
    }
    productManager.addProduct(product)
    // Convert the object to string to compare
    const objProduct = JSON.parse(JSON.stringify(product))
    const objDBProduct = JSON.parse(JSON.stringify(productManager.getProductByCode('TEST2')))
    delete objDBProduct.id
    expect(objDBProduct).toEqual(objProduct)
    productManager.removeProductByCode('TEST2')
    expect(() => productManager.getProductByCode('TEST2')).toThrowError('The code TEST2 doesnt exist, please verify and try again.')
  })
})

describe('ProductManager', () => {
  it('should get all products', () => {
    const productManager = new ProductManager('./products.txt')
    const product = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 10,
      code: 'TEST3',
      stock: 5,
      category: 'Test',
      statusItem: true
    }
    productManager.addProduct(product)
    const products = productManager.getAllProducts()
    expect(products).toHaveLength(1)
    productManager.removeProductByCode('TEST3')
  })
})

describe('ProductManager', () => {
  it('shouldnt add if we doesnt have all the mandatory fields', () => {
    const productManager = new ProductManager('./products.txt')
    const product = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 10,
      code: 'TEST2',
      stock: 5,
      statusItem: true
    }
    expect(() => productManager.addProduct(product)).toThrowError('BAD REQUEST: Hey!!! You are missing one or more required fields. Please provide values for title, description, price, code, stock, category or statusItem to continue.')
  })
})

describe('ProductManager', () => {
  it('shouldnt add a product with duplicated code', () => {
    const productManager = new ProductManager('./products.txt')
    const product = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 10,
      code: 'TEST6',
      stock: 5,
      category: 'Test',
      statusItem: true
    }
    productManager.addProduct(product)
    expect(() => productManager.addProduct(product)).toThrowError('The code TEST6 is already in use Code must be unique.')
    productManager.removeProductByCode('TEST6')
  })
})

describe('ProductManager', () => {
  it('should return an empty array if we dont load a path as file', () => {
    const productManager = new ProductManager()
    const products = productManager.getAllProducts()
    expect(products).toHaveLength(0)
  })
})

describe('ProductManager', () => {
  it('should return an empty array if we dont have data in the file', () => {
    const productManager = new ProductManager('./products.txt')
    const result = productManager.checkFile()
    expect(result).toEqual([])
  })
})
