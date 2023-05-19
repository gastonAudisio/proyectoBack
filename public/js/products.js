
const socket = io();

const btnCrearProducto = document.getElementById("btnCrearProducto");
const deleteButton = document.getElementById("delButton");
const delAll = document.getElementById("removeAllProducts")

//----------------------------------------------------------------------


document.querySelectorAll('.cartButton').forEach(btn => {
  btn.addEventListener('click', function(event) {
      event.preventDefault();
      const productId = this.dataset.productId;
      console.log(productId);
      console.log(cartId);
      fetch(`/api/carts/${cartId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({productId})
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                console.log('Success:', data);
                alert('Producto agregado al carrito');
              })
              .catch(error => {
                console.error('Error:', error);
              });
      
  });
});
//----------------------------------------------------------------------
document.querySelectorAll('.removeProductButton').forEach(btn => {
  btn.addEventListener('click', function(event) {
      event.preventDefault();
      const productId = this.dataset.productId;
      console.log(productId);
      console.log(cartId);
      fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({productId})
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                console.log('Success:', data);
                alert('Producto eliminado del carrito');
              })
              .catch(error => {
                console.error('Error:', error);
              });
      
  });
});
//----------------------------------------------------------------------
function getProductId(button) {
  const productId = button.dataset.productId;
  return productId;
}

function getId() {
  const idToDelete = document.getElementById("delId").value;
  return idToDelete;
}
//----------------------------------------------------------------------
const removeAllProducts = document.getElementById('removeAllProducts');
removeAllProducts.addEventListener('click', function(event) {
  event.preventDefault();
  fetch(`/api/carts/${cartId}/products`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    alert('Todos los productos fueron eliminados del carrito');
  })
  .catch(error => {
    console.error('Error:', error);
  });
});

//------------------------------------------------------------------------------------

function dataProduct() {
  const inputCodigo = document.getElementById("codigo").value;
  const inputTitulo = document.getElementById("titulo").value;
  const inputDescripcion = document.getElementById("descripcion").value;
  const inputPrecio = document.getElementById("precio").value;
  const inputThumbnail = document.getElementById("thumbnail").value;
  const inputStock = document.getElementById("stock").value;
  const inputCategoria = document.getElementById("categoria").value;
  const inputStatus = document.getElementById("status").value;

  if (!(inputCodigo == "" || inputTitulo == "" || inputDescripcion == "" || inputThumbnail == "" || inputCategoria == "")) {
    if (isNaN(inputPrecio) || isNaN(inputStock)) {
      return alert("Los campos Precio y Stock deben ser números");
    } else {
      const product = {
        code: inputCodigo,
        title: inputTitulo,
        description: inputDescripcion,
        price: inputPrecio,
        thumbnail: inputThumbnail,
        stock: inputStock,
        category: inputCategoria,
        status: inputStatus,
      };
      console.log(product)
      return product;

    }
  } else {
    return alert("Debe completar todos los campos");
  }
}



btnCrearProducto.addEventListener("click", (evt) => {
  let productData = dataProduct();
  socket.emit("product",productData);
});

deleteButton.addEventListener("click", (evt) =>{
  let id = getId()
  socket.emit("id", id)
})

