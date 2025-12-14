// Step 4: Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(() => console.log('Service Worker registered!'))
    .catch(err => console.log('Service Worker failed:', err));
}

// Mobile menu toggle: toggles .active on the menu and .is-active on the hamburger for animation
(function(){
    var btn = document.getElementById('mobile-menu');
    var menu = document.querySelector('.navbar__menu');
    if(!btn || !menu) return;
    btn.setAttribute('aria-controls', 'navbar-menu');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('id', 'navbar-menu');

    btn.addEventListener('click', function(){
        var isActive = menu.classList.toggle('active');
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-expanded', String(isActive));
    });
})();
