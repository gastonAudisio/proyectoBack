

const socket = io();

const btnCrearProducto = document.getElementById("btnCrearProducto");
const deleteButton = document.getElementById("delButton");
const delAll = document.getElementById("removeAllProducts")

//----------------------------------------------------------------------

document.querySelectorAll('.quantity-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const quantityInput = this.parentNode.querySelector('.quantity');
    let quantity = parseInt(quantityInput.value);

    if (this.classList.contains('plus')) {
      quantity++;
    } else if (this.classList.contains('minus')) {
      quantity = Math.max(1, quantity - 1);
    }
    quantityInput.value = quantity;
    console.log(quantity);
  });
});

//----------------------------------------------------------------------
// Agregar el producto al carrito
document.querySelectorAll('.cartButton').forEach(btn => {
  btn.addEventListener('click', function(event) {
    event.preventDefault();
    const productId = this.dataset.productId;
    const quantityInput = this.parentNode.querySelector('.quantity');
    const quantity = quantityInput.value;
    console.log(productId);
    console.log(cartId);
    fetch(`/api/carts/${cartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity })
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
// Eliminar producto del carrito
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
// Eliminar producto de la DB
function getProductId(button) {
  const productId = button.dataset.productId;
  return productId;
}

function getId() {
  const idToDelete = document.getElementById("delId").value;
  
  if (!idToDelete) {
    alert("Por favor ingresa un ID válido para eliminar el producto.");
    return;
  }
  alert("Producto eliminado correctamente ");
  return idToDelete;
}
//----------------------------------------------------------------------
// Eliminar todos los productos del carrito
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

//-----------------------------------------------------------------------
// Formulario para crear producto 
function validateProductData(data) {
  if (!data.code || !data.title || !data.description || !data.thumbnail || !data.category) {
    return false;
  }
  if (isNaN(data.price) || isNaN(data.stock)) {
    return false;
  }
  return true;
}

btnCrearProducto.addEventListener("click", (evt) => {
  const inputCodigo = document.getElementById("codigo").value;
  const inputTitulo = document.getElementById("titulo").value;
  const inputDescripcion = document.getElementById("descripcion").value;
  const inputPrecio = document.getElementById("precio").value;
  const inputThumbnail = document.getElementById("thumbnail").value;
  const inputStock = document.getElementById("stock").value;
  const inputCategoria = document.getElementById("categoria").value;
  const inputStatus = document.getElementById("status").value;

  const productData = {
    code: inputCodigo,
    title: inputTitulo,
    description: inputDescripcion,
    price: inputPrecio,
    thumbnail: inputThumbnail,
    stock: inputStock,
    category: inputCategoria,
    status: inputStatus,
  };

  if (validateProductData(productData)) {
    alert("PRODUCT CREADO");
    socket.emit("product", productData);
  } else {
    alert("Por favor completa todos los campos obligatorios y asegúrate de que los campos de precio y stock sean números válidos.");
  }
});


//-----------------------------------------------------------------------
btnCrearProducto.addEventListener("click", (evt) => {
  let productData = dataProduct();
  socket.emit("product",productData);
 
});


deleteButton.addEventListener("click", (evt) =>{
  let id = getId()
  socket.emit("id", id)
})

socket.on("productDeleted", (data) => {
  if (data.success) {
    alert("Producto eliminado correctamente.");
  } else {
    alert("No se pudo eliminar el producto. Por favor verifica el ID.");
  }
});




