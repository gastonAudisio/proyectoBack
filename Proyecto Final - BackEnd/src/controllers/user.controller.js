import { userModel } from '../models/user.model.js';
import { generateUser } from '../utils.js'
import { sendInactiveAccountEmail } from './email.controller.js';

export const getUsers = async (req, res) => {
    try {
        let users = [];
        for (let i = 0; i < 100; i++) {
            users.push(generateUser());
        }
        res.send({ status: "success", payload: users });
    } catch (error) {
        req.logger.error(error);
        res.status(500).send(getErrorMessage('ERROR_USER'));
    }
};

export const allUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        console.log(users);
        res.render("allUsers", { users: JSON.parse(JSON.stringify(users)) }); 
    } catch (error) {
        req.logger.error(error);
        res.status(500).send(getErrorMessage('ERROR_USER'));
    }
};

export const deleteUserById = async (userId) => {
    try {
        await userModel.findByIdAndDelete(userId);
        console.log(`Usuario con ID ${userId} eliminado`);
    } catch (error) {
        console.error(`Error al eliminar el usuario con ID ${userId}:`, error);
    }
};

export const getInactiveUsers = async (inactiveThreshold) => {
    try {
        const inactiveUsers = await userModel.find({ lastConnection: { $lt: inactiveThreshold } });
        console.log(inactiveUsers);
        return inactiveUsers;
    } catch (error) {
        console.error('Error al obtener usuarios inactivos:', error);
        return [];
    }
};

export const handleInactiveUsersDeletion = async () => {
    try {
        const currentDate = new Date();
        // const inactiveThreshold = new Date(currentDate - 2 * 24 * 60 * 60 * 1000);
        const inactiveThreshold = new Date(currentDate - 5 * 60 * 1000);
        /*a modo de prueba,se eliminan los usuarios que no se conectaron en
        los ultimos 5 min*/

        const inactiveUsers = await getInactiveUsers(inactiveThreshold);

        const deletionPromises = inactiveUsers.map(async (user) => {
            await deleteUserById(user._id); 
            await sendInactiveAccountEmail(user.email); 
        });

        await Promise.all(deletionPromises);

        console.log('Usuarios inactivos eliminados y correos enviados');
    } catch (error) {
        console.error('Error al manejar usuarios inactivos:', error);
    }
};



export const deleteUserId = async (req, res) => {
    const userId = req.params.id;
    try {
        await userModel.findByIdAndDelete(userId);
        console.log(`Usuario con ID ${userId} eliminado`);
        res.status(200).json({ message: `Usuario con ID ${userId} eliminado` });
    } catch (error) {
        console.error(`Error al eliminar el usuario con ID ${userId}:`, error);
        res.status(500).json({ error: `Error al eliminar el usuario con ID ${userId}` });
    }
};

export const updateUserRole = async (req, res) => {
    try {
      const userId = req.params.id;
      const { newRole } = req.body;
  
      // Verificar si el usuario existe
      const user = await userModel.findById(userId);
      if (!user) {
        console.error(`Usuario con ID ${userId} no encontrado`);
        res.status(500).send(`Usuario con ID ${userId} no encontrado`);
        return;
      }
  
      // Actualizar el rol del usuario
      user.rol = newRole;
      await user.save();
  
      console.log(`Rol del usuario con ID ${userId} actualizado a ${newRole}`);
      res.status(200).json({ message: `Rol del usuario con ID ${userId} actualizado correctamente` });
    } catch (error) {
      console.error(`Error al actualizar el rol del usuario con ID ${userId}:`, error);
      res.status(500).send(`Error al actualizar el rol del usuario con ID ${userId}`);
    }
  };