document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
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
                        // Aquí puedes realizar cualquier acción adicional después de la eliminación
                        // Por ejemplo, actualizar la lista de usuarios.
                    } else {
                        console.error(`Error al eliminar el usuario con ID ${userId}`);
                    }
                })
                .catch(error => console.error(error));
            }
        });
    });
});