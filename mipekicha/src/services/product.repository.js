import ProdutDTO from '../dao/DTO/product.dto.js'

class ProductRepository {

    constructor (dao) {
        this.dao = dao
    }

    addProduct = async (data) => { return await this.dao.createProduct(data) }
    updateProduct = async (pid, data) => { return await this.dao.updateProduct(pid, data) }
    removeProductById = async (pid) => { return await this.dao.deleteProductById(pid) }
    removeProductByCode = async (pcode) => { return await this.dao.deleteProductByCode(pcode) }
    retrieveAllProducts = async () => { return await this.dao.getAllProducts() }
    retrieveProductById = async (pid) => { return await this.dao.getProductById(pid) }
    retrieveProductByCode = async (pcode) => { return await this.dao.getProductByCode(pcode) }
}

export default ProductRepository