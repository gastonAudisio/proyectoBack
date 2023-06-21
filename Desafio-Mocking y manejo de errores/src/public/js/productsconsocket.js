const socket = io();
const btnCrearProducto = document.getElementById("btnCrearProducto");
const deleteButton = document.getElementById("delButton");
let products 

function getId(){
  const idToDelete = parseInt(document.getElementById("delId").value)
  return idToDelete
}
function dataProduct(){

  const inputCodigo = document.getElementById('codigo').value;
  const inputTitulo = document.getElementById('titulo').value;
  const inputDescripcion = document.getElementById('descripcion').value;
  const inputPrecio = document.getElementById('precio').value;
  const inputThumbnail = document.getElementById('thumbnail').value;
  const inputStock = document.getElementById('stock').value;
  const inputCategoria = document.getElementById('categoria').value;
  const inputStatus = document.getElementById('status').value;

  if (!(inputCodigo == "" || inputTitulo == "" || inputDescripcion == "" || inputThumbnail == "" || inputCategoria == ""))
  {
    if(isNaN(inputPrecio) || isNaN(inputStock)) {
      return alert("Los campos Precio y Stock deben ser números");
    } else {
      products = {
            code: inputCodigo,
            title: inputTitulo,
            description: inputDescripcion,
            price: inputPrecio,
            thumbnail: inputThumbnail,
            stock: inputStock,
            category: inputCategoria,
            status: inputStatus
      }
      return products;
    }
  }
  else 
    {
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