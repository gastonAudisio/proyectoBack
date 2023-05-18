import fs from 'node:fs';

class Product{
  constructor(code,title,description,price,thumbnail,stock,category,status){
      this.code = code;
      this.title = title;
      this.description = description;
      this.price = price;
      this.thumbnail = thumbnail;
      this.stock = stock;
      this.category = category;
      this.status = status
      
  }
};

class ProductManager {

  #users;
  #userDirPath;
  #usersFilePath;
  #fileSystem;

  

  constructor(){
      this.#users = new Array();
      this.#userDirPath = "./files";
      this.#usersFilePath = this.#userDirPath+"/DB.json";
      this.#fileSystem = fs;
  }

//------------------------ METODOS ---------------------------------------

#prepararDirectorioBase = async () =>{
  //Creamos el directorio
  await this.#fileSystem.promises.mkdir(this.#userDirPath, { recursive: true });
 if(!this.#fileSystem.existsSync(this.#usersFilePath)) {
     //Se crea el archivo vacio.
     await this.#fileSystem.promises.writeFile(this.#usersFilePath, "[]");
 }
}

//------------------------------------------------------------------------

addProduct = async (code,title,description,price,thumbnail,stock,category,status) => {
  let usuarioNuevo = new Product(code,title,description,price,thumbnail,stock,category,status);
  const addNewProduct = {
    productId: Date.now(),
    ...usuarioNuevo,  
  };
  console.log("Crear Producto:");
  console.log(usuarioNuevo);
  try {
      await this.#prepararDirectorioBase();
      await this.getProduct();
      
      if (this.#users.find(u => u.productId === addNewProduct.productId)) {
          console.warn("El producto ya existe, revise los datos nuevamente.");
      } else {
      
          this.#users.push(addNewProduct);
          console.log("Lista actualizada de Productos: ");
          console.log(this.#users);
          //Se sobreescribe el archivos de usuarios para persistencia.
          await this.#fileSystem.promises.writeFile(this.#usersFilePath, JSON.stringify(this.#users,null, 2));
      }
  } catch (error) {
      console.error(`Error creando producto nuevo: ${JSON.stringify(addNewProduct)}, detalle del error: ${error}`);
      throw Error(`Error creando producto nuevo: ${JSON.stringify(addNewProduct)}, detalle del error: ${error}`);
  }
}
//------------------------------------------------------------------------

addProductForm = async (product) => {
  const addNewProduct = {
    productId: Date.now(),
    ...product,
  };
  console.log("Crear Producto:");
  console.log(addNewProduct);
  try {
      await this.#prepararDirectorioBase();
      await this.getProduct();
      
      if (this.#users.find(u => u.productId === addNewProduct.productId)) {
          console.warn("El producto ya existe, revise los datos nuevamente.");
      } else {
          this.#users.push(addNewProduct);
          console.log("Lista actualizada de Productos: ");
          console.log(this.#users);
          //Se sobreescribe el archivos de usuarios para persistencia.
          await this.#fileSystem.promises.writeFile(this.#usersFilePath, JSON.stringify(this.#users,null, 2));
      }
  } catch (error) {
      console.error(`Error creando producto nuevo: ${JSON.stringify(addNewProduct)}, detalle del error: ${error}`);
      throw Error(`Error creando producto nuevo: ${JSON.stringify(addNewProduct)}, detalle del error: ${error}`);
  }
}

//---------------------------------------------------------------------------


getProduct = async () =>{
  try {
      //Validamos que exista ya el archivo con usuarios sino se crea vacío para ingresar nuevos:
      await this.#prepararDirectorioBase();
      //leemos el archivo
      let usuariosFile = await this.#fileSystem.promises.readFile(this.#usersFilePath, "utf-8");
      //Cargamos los usuarios encontrados para agregar el nuevo:
      //Obtenemos el JSON String 
      this.#users = JSON.parse(usuariosFile);
      console.log("Productos encontrados: ");
      console.log(this.#users);
      return this.#users;
  } catch (error) {
      console.error(`Error consultando los usuarios por archivo, valide el archivo: ${this.#userDirPath}, 
          detalle del error: ${error}`);
      throw Error(`Error consultando los usuarios por archivo, valide el archivo: ${this.#userDirPath},
      detalle del error: ${error}`);
  }
}
//----------------------------------------------------------------------------


//----------------------------------------------------------------------------

getProductById = async (productId) => {
  try {
    await this.#prepararDirectorioBase();
    await this.getProduct();
    const productFinded = this.#users.find(
      (product) => product.productId === productId
    );

    if (!productFinded) throw new Error(`Product ${productId} Not Found!`);
      console.log("---------getProductById----------");
      console.log(productFinded);
      return(productFinded);
  } catch (error) {
    throw error;
  }

  }

//----------------------------------------------------------------------------

updateProduct = async (productId, updateData) => {
  try {
    await this.#prepararDirectorioBase();
    const productIndex = this.#users.findIndex((product) => product.productId === productId);
    if (productIndex === -1) {
      throw new Error(`Product ${productId} not found!`);
    }
    const updatedProduct = {...this.#users[productIndex], ...updateData};
    this.#users[productIndex] = updatedProduct;
    await this.#fileSystem.promises.writeFile(this.#usersFilePath, JSON.stringify(this.#users, null, 2));
    console.log(`Product ${productId} updated:`, updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
}
//----------------------------------------------------------------------------


deleteProduct = async (productId) => {
  try {
    await this.#prepararDirectorioBase();
    const productFinded = await this.getProductById(productId);
    
    if (productFinded) {
      const index = this.#users.findIndex((product) => product.productId === productId);
      if (index === -1) {
        console.log(`Producto ${productId} no encontrado`);
        return;
      }
      this.#users.splice(index, 1);
      console.log(`Producto ${productId} eliminado`);
      console.log(this.#users);
      await this.#fileSystem.promises.writeFile(this.#usersFilePath, JSON.stringify(this.#users, null, 2));
    }
  } catch (error) {
    console.error(`Error eliminando el producto con id: ${productId}. Detalle del error: ${error}`);
    throw Error(`Error eliminando el producto con id: ${productId}. Detalle del error: ${error}`);
  }
}


};

export default ProductManager;
