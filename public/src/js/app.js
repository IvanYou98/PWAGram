var deferredPrompt;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(function() {
            console.log('Service worker registered!');
        });
}


window.addEventListener('beforeinstallprompt', function(event) {
    event.preventDefault();
    if (!deferredPrompt) {
        deferredPrompt = event;
    }
    return false;
});