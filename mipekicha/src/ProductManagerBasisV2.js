/*
Go to cd mipekicha/src
Run node ProductManagerBasisV2.js
*/
const fs = require('fs')

class ProductManagerV2 {
    constructor(filePath) {
        this.productIdCounter = 1
        this.filePath = filePath
        this.products = this.checkFile()
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {

        // First Validate if we have all the required fields
        if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
            console.error("Hey!!! You are missing one or more required fields. Please provide values for title, description, price, thumbnail, code, and stock to continue.")
            return
        }

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
            }
            this.products.push(product)
            this.saveFile()
            this.productIdCounter++
        }
    }

    removeProductByCode(code) {
        const index = this.products.findIndex((product) => product.code === code)
        if (index !== -1) {
            this.products.splice(index, 1)
            this.saveFile()
        } else {
            throw new Error(`The code ${code} doesnt exist, please verify and try again.`)
        }
    }

    removeProductById(id) {
        const index = this.products.findIndex((product) => product.id === id)
        if (index !== -1) {
            this.products.splice(index, 1)
            this.saveFile()
        } else {
            throw new Error(`The id ${id} doesnt exist, please verify and try again.`)
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
            this.saveFile()
        }
    }

    updateProductById(id, updatedProduct) {
        const index = this.products.findIndex((product) => product.id === id)
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct }
            this.saveFile()
        }
    }

    updateProductList(newProductList) {
        this.products = newProductList
    }

    getAllProducts() {
        return this.products
    }

    checkFile() {
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

    saveFile() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2))
    }
}

let listElements = new ProductManagerV2('./products.txt')

// Products Creation Section
const productOne = {
    title: "Collar Slim",
    description: "½ pulgada de ancho Nombre y 1 numero de tel bordado",
    price: 100,
    thumbnail: "https://raknarrok.github.io/static/images/productos/collares/slim.png",
    code: "CXS",
    stock: 10
}

const productTwo = {
    title: "Collar Normal",
    description: "1 pulgada de ancho Nombre y 1 numero de tel bordado",
    price: 200,
    thumbnail: "https://raknarrok.github.io/static/images/productos/collares/normal.png",
    code: "CN",
    stock: 10
}

const productThree = {
    title: "Collar Ancho",
    description: "1 ½ pulgada de ancho Nombre y 1 numero de tel bordado",
    price: 200,
    thumbnail: "https://raknarrok.github.io/static/images/productos/collares/ancho.png",
    code: "CA",
    stock: 30
}

const productFour = {
    title: "Collar Especial",
    description: "Diferentes anchos, colores y diseños. Nombre y 1 numero de tel bordado",
    price: 450,
    thumbnail: "https://raknarrok.github.io/static/images/productos/collares/ancho.png",
    code: "CE",
    stock: 5
}

const productMissingParameters = {
    title: "Collar Ancho",
    description: "1 ½ pulgada de ancho Nombre y 1 numero de tel bordado",
    price: 200,
    thumbnail: "https://raknarrok.github.io/static/images/productos/collares/ancho.png",
    code: "CA"
}

// Verify list is empty
console.log(`------Empty Array Is displayed`, listElements.getAllProducts())

// Adding products
listElements.addProduct(productOne)
listElements.addProduct(productTwo)
listElements.addProduct(productThree)
listElements.addProduct(productFour)

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

// Update product by ID
listElements.updateProductById(1, { title: "Collar Slim Actualizado", description: "½ pulgada de ancho Nombre y 1 numero de tel bordado", price: 500, thumbnail: "https://raknarrok.github.io/static/images/productos/collares/slim.png", code: "CXS", stock: 15 })

// Verify product was updated
console.log(`List of products after update item with ID 1`)
console.log(listElements.getAllProducts())

// Removing product by code
listElements.removeProductById(4)

// Verify product was removed
console.log(`List of products after remove item with ID 4`)
console.log(listElements.getAllProducts())

// Show a message in case to missing required fields
listElements.addProduct(productMissingParameters)

// Dropping error when trying to add a product with a code already in use (Its working with direct parameters)
listElements.addProduct("Collar Ancho", "1 ½ pulgada de ancho Nombre y 1 numero de tel bordado", 300, "https://raknarrok.github.io/static/images/productos/collares/ancho.png", "CA", 30)
