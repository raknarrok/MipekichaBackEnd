import express from 'express'
import ProductManager from '../controllers/ProductManager.js'
import __dirname from '../utils.js'
const productManager = new ProductManager('./products.txt')

console.log("dirpath -> ", __dirname)

const router = express.Router()

router.get('/',( req, res)=>{

    const allProducts = productManager.getAllProducts()
    console.log("AllPorducts -> ", allProducts)

    // This is the name under Views > home.handlebars
    res.render('home', {
        isAdmin: false,
        products: allProducts
    })

})

export default router
