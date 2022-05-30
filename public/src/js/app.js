// check the availability
console.log("hello from app.js")
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
            console.log("Service worker registers!")
        });
}