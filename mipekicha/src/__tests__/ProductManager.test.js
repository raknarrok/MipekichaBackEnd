const ProductManager = require('../ProductManager')

describe('ProductManager', () => {
  it('should add a product', () => {
    const productManager = new ProductManager('./products_test.txt')
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
  })
})

describe('ProductManager', () => {
  it('should remove a product', () => {
    const productManager = new ProductManager('./products_test.txt')
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
    productManager.removeProductByCode('TEST1')
    const products = productManager.getAllProducts()
    expect(products).toHaveLength(0)
  })
})

describe('ProductManager', () => {
  it('should get all products', () => {
    const productManager = new ProductManager('./products_test.txt')
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
  })
})

describe('ProductManager', () => {
  it('shouldnt add if we doesnt have all the mandatory fields', () => {
    const productManager = new ProductManager('./products_test.txt')
    const product = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 10,
      code: 'TEST2',
      stock: 5,
      statusItem: true
    }
    productManager.addProduct(product)
    const products = productManager.getProductByCode('TEST2')
    expect('Not Found').toBe('Not Found')
  })
})
