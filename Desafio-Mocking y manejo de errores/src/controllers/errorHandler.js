export const getErrorMessage = (errorCode) => {
    const errorDictionary = {
      'PRODUCT_NOT_FOUND': 'El producto no se encontró.',
      'INVALID_QUANTITY': 'La cantidad proporcionada no es válida.',
      'CART_NOT_FOUND': 'El carrito no se encontró.',
      
    };
  
    return errorDictionary[errorCode] || 'Error desconocido.';
  };