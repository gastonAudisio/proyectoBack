const buy = document.getElementById('comprar');

buy.addEventListener('click', e => {
    e.preventDefault();
    window.location.replace('/launcher');
});
