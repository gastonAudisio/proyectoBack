const form = document.getElementById('logout');

form.addEventListener('click', e => {
    e.preventDefault();
    fetch('/api/sessions/logout', {
        method: 'GET'
    }).then(result => {
        if(result.status === 200) {
            window.location.replace('/users/login');
        }
    })
});
