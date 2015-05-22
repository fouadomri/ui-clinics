if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('worker.js').then(function (registration) {
        console.log('Yo', registration.scope);
    }).catch(function (err) {
        console.log('No Yo!!', err);
    });
}