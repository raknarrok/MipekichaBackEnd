/*
Go to cd mipekicha/src
Run node ProductManagerBasis.js
*/

class ProductManager {
    constructor() {
        this.products = []
        this.productIdCounter = 1
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        // Verify if the code is already in use
        const isCodeInUse = this.products.some((product) => product.code === code)
        if (isCodeInUse) {
            throw new Error(`The code ${code} is already in use Code must be unique.`)
        }

        if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
            console.error("Hey!!! You are missing one or more required fields. Please provide values for title, description, price, thumbnail, code, and stock to continue.")
            return
          }

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
        const product = this.products.find((product) => product.code === code)
        if (!product) {
            return "Not Found"
        }
        return product
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


listElements = new ProductManager()

// Verify list is empty
console.log(`Empty Array Is displayed`, listElements.getAllProducts())

// Adding products
listElements.addProduct("Collar Slim", "½ pulgada de ancho Nombre y 1 numero de tel bordado", 100, "https://raknarrok.github.io/static/images/productos/collares/slim.png", "CXS", 10)
listElements.addProduct("Collar Normal", "1 pulgada de ancho Nombre y 1 numero de tel bordado", 200, "https://raknarrok.github.io/static/images/productos/collares/normal.png", "CN", 20)
listElements.addProduct("Collar Ancho", "1 ½ pulgada de ancho Nombre y 1 numero de tel bordado", 300, "https://raknarrok.github.io/static/images/productos/collares/ancho.png", "CA", 30)

// Verify prducts were added
console.log(`List of products added`)
console.log(listElements.getAllProducts())

// Removing product by code
listElements.removeProductByCode("CN")

// Verify product was removed
console.log(`List of products after remove item with code CN`)
console.log(listElements.getAllProducts())

// Search Existing element by Id
console.log(`Search Element by Id`)
console.log(listElements.getProductByCode("CA"))

// Search Non Existing element by Id
console.log(`Search Element by Id`)
console.log(listElements.getProductByCode("NoExistsNumber"))

// Show a message in case to missing required fields
listElements.addProduct("Collar Ancho", "1 ½ pulgada de ancho Nombre y 1 numero de tel bordado", 300, "https://raknarrok.github.io/static/images/productos/collares/ancho.png", "")

// Dropping error when trying to add a product with a code already in use
listElements.addProduct("Collar Ancho", "1 ½ pulgada de ancho Nombre y 1 numero de tel bordado", 300, "https://raknarrok.github.io/static/images/productos/collares/ancho.png", "CA", 30)