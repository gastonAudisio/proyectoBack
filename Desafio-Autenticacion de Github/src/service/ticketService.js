import { ticketModel } from '../models/ticket.model.js'


export const ticketService = {
    createTicket: async (cart,userEmail, failedProducts) => {
      try {
        const ticket = new ticketModel({
          code: Math.floor(Math.random() * 100000), // Generar un código de ticket aleatorio
          purchase_datetime: new Date(),
          amount: cart.products.reduce((total, item) => total + item.quantity * item.product.price, 0),
          purchaser: userEmail,
        });
  
        // Guardar el ticket en la base de datos
        await ticket.save();
  
        return ticket;
      } catch (error) {
        console.error('Error al crear el ticket:', error);
        throw error;
      }
    },
  };