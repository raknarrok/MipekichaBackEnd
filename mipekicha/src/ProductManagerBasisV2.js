/*
Go to cd mipekicha/src
Run node ProductManagerBasisV2.js
*/
const fs = require('fs')
const filePath = './products.txt'

class ProductManagerV2 {
    constructor() {
        this.products = []
        this.productIdCounter = 1
    }

    addProduct(title, description, price, thumbnail, code, stock) {

        // First Validate if we have all the required fields
        if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
            console.error("Hey!!! You are missing one or more required fields. Please provide values for title, description, price, thumbnail, code, and stock to continue.")
            return
        }

        // Read the file and parse the content to an array
        const fileContent = fs.readFileSync(filePath, 'utf8')

        // Verify if the file is empty.
        if (fileContent) {
            // If the file is not empty, parse the content to an array
            this.products = JSON.parse(fileContent)
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
            }
            this.products.push(product)
            fs.writeFileSync(filePath, JSON.stringify(this.products, null, 2))
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
            }
            this.products.push(product)
            fs.writeFileSync(filePath, JSON.stringify(this.products, null, 2))
            this.productIdCounter++
        }
    }

    removeProductByCode(code) {
        const fileContent = fs.readFileSync(filePath, 'utf8')
        this.products = JSON.parse(fileContent)
        const index = this.products.findIndex((product) => product.code === code)
        if (index !== -1) {
            this.products.splice(index, 1)
            fs.writeFileSync('./products.txt', JSON.stringify(this.products, null, 2))
        } else {
            throw new Error(`The code ${code} doesnt exist, please verify and try again.`)
        }
    }

    removeProduct(product) {
        this.removeProductByCode(product.code);
    }

    getProductByCode(code) {
        const fileContent = fs.readFileSync(filePath, 'utf8')
        this.products = JSON.parse(fileContent)
        const product = this.products.find((product) => product.code === code)
        if (!product) {
            return "Not Found"
        }
        return product
    }

    updateProductByCode(code, updatedProduct) {
        const fileContent = fs.readFileSync(filePath, 'utf8')
        this.products = JSON.parse(fileContent)
        const index = this.products.findIndex((product) => product.code === code)
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct }
            fs.writeFileSync('./products.txt', JSON.stringify(this.products, null, 2))
        }
    }

    updateProductList(newProductList) {
        this.products = newProductList
    }

    getAllProducts() {
        // Read the file and parse the content to an array
        const fileContent = fs.readFileSync(filePath, 'utf8')
        // Verify if the file is empty.
        if (!fileContent) {
            return []
        }

        return JSON.parse(fileContent)
    }
}


listElements = new ProductManagerV2()

// Verify list is empty
console.log(`------Empty Array Is displayed`, listElements.getAllProducts())

// Adding products
listElements.addProduct("Collar Slim", "½ pulgada de ancho Nombre y 1 numero de tel bordado", 100, "https://raknarrok.github.io/static/images/productos/collares/slim.png", "CXS", 10)
listElements.addProduct("Collar Normal", "1 pulgada de ancho Nombre y 1 numero de tel bordado", 200, "https://raknarrok.github.io/static/images/productos/collares/normal.png", "CN", 20)
listElements.addProduct("Collar Ancho", "1 ½ pulgada de ancho Nombre y 1 numero de tel bordado", 300, "https://raknarrok.github.io/static/images/productos/collares/ancho.png", "CA", 30)

// Verify prducts were added
console.log(`------List of products added`)
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

// Update product by code
listElements.updateProductByCode("CA", { title: "Collar Ancho Actualizado", description: "1 ½ pulgada de ancho Nombre y 1 numero de tel bordado Actualizado", price: 400, thumbnail: "https://raknarrok.github.io/static/images/productos/collares/ancho.png", code: "CA", stock: 10 })

// Verify product was updated
console.log(`List of products after update item with code CA`)
console.log(listElements.getAllProducts())

// Show a message in case to missing required fields
listElements.addProduct("Collar Ancho", "1 ½ pulgada de ancho Nombre y 1 numero de tel bordado", 300, "https://raknarrok.github.io/static/images/productos/collares/ancho.png", "")

// Dropping error when trying to add a product with a code already in use
listElements.addProduct("Collar Ancho", "1 ½ pulgada de ancho Nombre y 1 numero de tel bordado", 300, "https://raknarrok.github.io/static/images/productos/collares/ancho.png", "CA", 30)
