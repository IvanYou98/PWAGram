// check the availability
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
            console.log("Service worker registers!")
        });
}

// window.addEventListener('beforeinstallprompt', (event) => {
//     console.log('before instll prompt fired');
//     event.preventDefault();
//     deferredPrompt = event;
//     return false;
// })