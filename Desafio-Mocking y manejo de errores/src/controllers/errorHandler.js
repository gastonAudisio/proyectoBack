export const getErrorMessage = (errorCode) => {
    const errorDictionary = {
      'PRODUCT_NOT_FOUND': 'El producto no se encontró.',
      'ERROR_DELETE_PRODUCT': 'El producto no se pudo eliminar.',
      'ERROR_UPDATE_PRODUCT': 'El producto no se pudo actualizar el producto.',
      'ERROR_CREATE_PRODUCT': 'El producto no se pudo crear el producto.',
      'INVALID_QUANTITY': 'La cantidad proporcionada no es válida.',
      'CARTS_NOT_FOUND': 'No se encontraron carritos de compras',
      'CART_NOT_FOUND': 'El carrito no se encontró.',
      'ERROR_CREATE_CART': 'No se pudo crear el carrito de compras',
      'ERROR_ADD_TO_CART': 'No se pudo agregar el producto al carrito',
      'ERROR_DELETE_TO_CART': 'No se pudo eliminar el producto del carrito',
      'ERROR_DELETE_ALL_TO_CART': 'No se pudieron eliminar los producto del carrito',
      'ERROR_DELETE_CART': 'No se pudo eliminar el carrito',
      'ERROR_EMAIL': 'No se pudo enviar el email.',
      'COMPLETE_ALL_FIELDS': 'Completar todos los campos.',
      'ERROR_PURCHASER': 'No se pudo realizar la compra',
      'ERROR_PURCHASER': 'No se pudo realizar la compra',
      'INSUFFICIENT_STOCK': 'stock insuficiente',
    };
  
    return errorDictionary[errorCode] || 'Error desconocido.';
  };