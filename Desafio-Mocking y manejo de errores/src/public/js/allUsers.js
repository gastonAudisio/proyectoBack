document.addEventListener('DOMContentLoaded', () => {
    const deleteLinks = document.querySelectorAll('.delete-user');

    deleteLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            
            const userId = link.getAttribute('data-user-id');
            
            if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
                fetch(`/users/allUsers/${userId}`, {
                    method: 'DELETE',
                })
                .then(result => {
                    if (result.status === 200) {
                        console.log(`Usuario con ID ${userId} eliminado`);
                        location.reload(); 
                    } else {
                        console.error(`Error al eliminar el usuario con ID ${userId}`);
                    }
                })
                .catch(error => console.error(error));
            }
        });
    });

    const updateRoleForms = document.querySelectorAll('.update-role-form');

    updateRoleForms.forEach(form => {
        form.addEventListener('submit', async e => {
            e.preventDefault();
            
            const userId = form.querySelector('.update-role-btn').getAttribute('data-user-id');
            console.log(`UserID capturado: ${userId}`);
            const newRole = form.querySelector('#newRole').value;
            console.log(`Nuevo rol capturado: ${newRole}`);
            
            try {
                const response = await fetch(`/users/allUsers/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, newRole }) 
                });
    
                if (response.status === 200) {
                    console.log(`Rol del usuario con ID ${userId} actualizado a ${newRole}`);
                    location.reload();
                } else {
                    console.error(`Error al actualizar el rol del usuario con ID ${userId}`);
                }
            } catch (error) {
                console.error(error);
            }
        });
    });
});

    

