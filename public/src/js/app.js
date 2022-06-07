var deferredPrompt;
let enableNotificationsBttons = document.querySelectorAll('.enable-notifications')

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

const displayConfirmNotification = () => {
    if ('serviceWorker' in navigator) {
        let options = {
            body: 'You successfully subscribed!',
            icon: '/src/images/icons/app-icon-96x96.png'
        }
        navigator.serviceWorker.ready.then(swreg => {
                swreg.showNotification('Congratulations from service worker!', options);
            }
        )
    }
}


const askForNotificationPermission = event => {
    Notification.requestPermission(result => {
        console.log('User Choice', result);
        if (result !== 'granted') {
            console.log('No notification persmission granted!');
        } else {
            displayConfirmNotification();
            console.log()
        }
    })
}

// if the current browser suppports notification
if ('Notification' in window) {
    console.log('Notification is supported!')
    enableNotificationsBttons.forEach(button => {
        button.style.display = 'inline-block';
        button.addEventListener('click', askForNotificationPermission);
    })
}