

import fs from 'node:fs';

class Cart {
  constructor() {
    
    this.products = [];
  }
}


class CartManager {
  #users;
  #userDirPath;
  #usersFilePath;
  #fileSystem;

  constructor() {
    this.#users = new Array();
    this.#userDirPath = "./files";
    this.#usersFilePath = this.#userDirPath+"/carts.json";
    this.#fileSystem = fs;
  }

  //------------------------ METHODS ---------------------------------------

  #prepararDirectorioBase = async () => {
    // Create the directory
    await this.#fileSystem.promises.mkdir(this.#userDirPath, { recursive: true });

    if(!this.#fileSystem.existsSync(this.#usersFilePath)) {
      // Create empty file.
      await this.#fileSystem.promises.writeFile(this.#usersFilePath, "[]");
    }
  }
//--------------------------------------------------------------------------
  addCart = async () => {
    const newCart = new Cart();
    const addNewCart = {
      ...newCart,
      cartId: Date.now()
    };
    console.log("Create Cart:");
    console.log(newCart);
    try {
      await this.#prepararDirectorioBase();
      await this.getCart();
      if (this.#users.find(u => u.cartId === addNewCart.cartId)) {
        console.warn("Cart already exists, check the data again.");
      } else {
        this.#users.push(addNewCart);
        console.log("Updated cart list: ");
        console.log(this.#users);
        // Overwrite the users file for persistence.
        await this.#fileSystem.promises.writeFile(this.#usersFilePath, JSON.stringify(this.#users,null, 2));
      }
    } catch (error) {
      console.error(`Error creating new cart: ${JSON.stringify(addNewCart)}, error detail: ${error}`);
      throw Error(`Error creating new cart: ${JSON.stringify(addNewCart)}, error detail: ${error}`);
    }
  }
//--------------------------------------------------------------------------
  getCart = async () =>{
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
//--------------------------------------------------------------------------
  getCartById = async (cartId) => {
    try {
      await this.#prepararDirectorioBase();
      await this.getCart();
      const cartFinded = this.#users.find(
        (cart) => cart.cartId === cartId
      );
  
      if (!cartFinded) throw new Error(`Cart ${cartId} Not Found!`);
        console.log("---------getProductById----------");
        console.log(cartFinded);
        return(cartFinded);
    } catch (error) {
      throw error;
    }
  
    }

//--------------------------------------------------------------------------



    async addProductToCart(cartId, productId) {
      const cart = await this.getCartById(cartId);
      if (!cart) {
        throw new Error(`Cart ${cartId} Not Found!`);
      }
      const productIndex = cart.products.findIndex(p => p.id === productId);
      if (productIndex >= 0) {
        cart.products[productIndex].quantity++;
        
      } else {
        let newP = {
          id: productId,
          quantity: 1,
        };
        cart.products.push(newP);
      }
      await this.#fileSystem.promises.writeFile(this.#usersFilePath, JSON.stringify(this.#users,null, 2));
      return cart;
    }




};

export default CartManager;



