import { ticketModel } from '../models/ticket.model.js';

export const ticketService = {
  createTicket: async (cart, failedProducts, userEmail) => {
    try {
      const ticket = new ticketModel({
        code: Math.floor(Math.random() * 100000),
        purchase_datetime: new Date(),
        amount: cart.products.reduce((total, item) => total + item.quantity * item.product.price, 0),
        purchaser: userEmail, 
      });

      await ticket.save();

      return ticket;
    } catch (error) {
      console.error('Error al crear el ticket:', error);
      throw error;
    }
  },
};




