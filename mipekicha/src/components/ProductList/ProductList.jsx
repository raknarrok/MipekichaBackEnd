import React from 'react'

const ProductList = ({ products, productManager, removeProduct })  => {

   const styleImg = {
    width: '18rem'
   }

   return (
    <div>
      <h2>Lista de Productos</h2>
      <ul>
        {products.map((product) => (
          <li key={product.code} id={product.code}>
            <p><b>Code:</b> {product.code}</p>
            <p><b>Nombre:</b> {product.title}</p>
            <p><b>Descripcon: </b>{product.description}</p>
            <p><b>Precio:</b> ${product.price}</p>
            <img src={product.thumbnail} className="card-img-top mt-2 rounded mx-auto" alt={product.id} style={styleImg}/>
            <p>Stock: {product.stock}</p>
            <button onClick={() => removeProduct(product.code)}>Eliminar</button>
            {/* <button onClick={() => productManager.removeProduct(product)}>Eliminar</button> */}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProductList
