import React, { useState } from 'react'
import ProductList from './components/ProductList/ProductList'
import ProductManager from './ProductManager'
import 'bootstrap/dist/css/bootstrap.min.css'

const productManager = new ProductManager()

const App = () => {

  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnail: '',
    code: '',
    stock: 0,
  })

  const addProduct = () => {
    productManager.addProduct(newProduct)
    setProducts([...products, newProduct])
    setNewProduct({
      title: '',
      description: '',
      price: 0,
      thumbnail: '',
      code: '',
      stock: 0,
    })
  }

  const removeProduct = (code) => {
    const updatedProducts = products.filter((product) => product.code !== code)
    setProducts(updatedProducts)
  }

  return (
    <div className="App">
      <h1>Gestión de Productos</h1>
      <div>
        <h2>Agregar Producto</h2>
        <input
          type="text"
          placeholder="Nombre del Producto"
          value={newProduct.title}
          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Imagen"
          value={newProduct.thumbnail}
          onChange={(e) => setNewProduct({ ...newProduct, thumbnail: e.target.value })}
        />
        <input
          type="text"
          placeholder="Code"
          value={newProduct.code}
          onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
        />
        <button onClick={addProduct} className="btn btn-primary">Agregar Producto</button>
        <p>
        <b>Data Test</b> -
          name- Collar Slim |
          quantity- 0 |
          desc- ½ pulgada de ancho Nombre y 1 numero de tel bordado |
          price- 1200 |
          img- https-//raknarrok.github.io/static/images/productos/collares/slim.png |
        </p>
        <p>
        <b>Data Test:</b> - 
          name- Collar Normal |
          quantity- 2 |
          desc- 1 pulgada de ancho Nombre y 1 numero de tel bordado |
          price- 1500 |
          img- https-//raknarrok.github.io/static/images/productos/collares/normal.png
        </p>

      </div>
      <ProductList products={products} productManager={productManager} removeProduct={removeProduct} />
    </div>
  )
}

export default App
