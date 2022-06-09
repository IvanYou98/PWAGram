let shareImageButton = document.querySelector('#share-image-button');
let createPostArea = document.querySelector('#create-post');
let closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
let sharedMomentsArea = document.querySelector('#shared-moments');
let videoPlayer = document.querySelector('#player');
let canvasElement = document.querySelector('#canvas');
let captureButton = document.querySelector('#capture-btn');
let imagePicker = document.querySelector('#image-picker');
let imagePickerArea = document.querySelector('#pick-image');
let picture;
let locationInput = document.querySelector('#location');
let locationBtn = document.querySelector('#location-btn');
let locationLoader = document.querySelector('#location-loader');
let fetchedLocation;

locationBtn.addEventListener('click', event => {
    console.log('location btn is clicked!')
    if (!('geolocation' in navigator)) {
        locationLoader.style.display = 'none';
    }
    locationBtn.style.display = 'none';
    locationLoader.style.display = 'block';

    navigator.geolocation.getCurrentPosition(position => {
        locationBtn.style.display = 'inline';
        locationLoader.style.display = 'none';
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        locationInput.value = '(' + latitude + ',' + longitude + ')';
        locationInput.classList.add('is-focused');

    }, positionError => {
        locationBtn.style.display = 'inline';
        locationLoader.style.display = 'none';
        alert('Could not fetch location, please enter manually!');
        fetchedLocation = null;
    }, {timeout: 7000});
})

const initializeLocation = () => {
    if (!('geolocation' in navigator)) {
        locationLoader.style.display = 'none';
    }
}

const initializeMedia = () => {
    if (!('mediaDevices' in navigator)) {
        navigator.mediaDevices = {};
    }
    if (!('getUserMedia' in navigator.mediaDevices)) {
        navigator.mediaDevices.getUserMedia = constraints => {
            let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented!'));
            }
            return new Promise(((resolve, reject) => {
                getUserMedia.call(navigator, constraints, resolve, reject);
            }));
        }
    }
    navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => {
            videoPlayer.srcObject = stream;
            videoPlayer.style.display = 'block';
        })
        .catch(err => {
            imagePickerArea.style.display = 'block';
        })
}

captureButton.addEventListener('click', event => {
    canvasElement.style.display = 'block';
    videoPlayer.style.display = 'none';
    captureButton.style.display = 'none';
    let context = canvasElement.getContext('2d');
    context.drawImage(videoPlayer, 0, 0, canvasElement.width, canvasElement.width * videoPlayer.videoHeight / (videoPlayer.videoWidth));
    videoPlayer.srcObject.getVideoTracks().forEach(track => track.stop());
    picture = dataURItoBlob(canvasElement.toDataURL());

});

const openCreatePostModal = () => {
    createPostArea.style.display = 'block';
    initializeMedia();
    initializeLocation();
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(({outcome}) => {
            if (outcome === 'dismissed') {
                console.log('User cancelled installation');
            } else {
                console.log('User added to home screen');
            }
        });
    }
}

const closeCreatePostModal = () => {
    createPostArea.style.display = 'none';
    imagePickerArea.style.display = 'none';
    videoPlayer.style.display = 'none';
    canvasElement.style.display = 'none';
    locationBtn.style.display = 'inline';
    locationLoader.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

function createCard(post) {
    var cardWrapper = document.createElement('div');
    cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
    var cardTitle = document.createElement('div');
    cardTitle.className = 'mdl-card__title';
    cardTitle.style.backgroundImage = 'url(' + post.image + ')';
    cardTitle.style.backgroundSize = 'cover';
    cardTitle.style.height = '180px';
    cardWrapper.appendChild(cardTitle);
    var cardTitleTextElement = document.createElement('h2');
    cardTitleTextElement.className = 'mdl-card__title-text';
    cardTitleTextElement.textContent = post.title;
    cardTitleTextElement.style.color = 'white';
    cardTitle.appendChild(cardTitleTextElement);
    var cardSupportingText = document.createElement('div');
    cardSupportingText.className = 'mdl-card__supporting-text';
    cardSupportingText.textContent = post.location;
    cardSupportingText.style.textAlign = 'center';
    cardWrapper.appendChild(cardSupportingText);
    componentHandler.upgradeElement(cardWrapper);
    sharedMomentsArea.appendChild(cardWrapper);
}

const clearCards = () => {
    while (sharedMomentsArea.hasChildNodes()) {
        sharedMomentsArea.removeChild(sharedMomentsArea.lastChild)
    }
}

const createCards = data => {
    let posts = [];
    for (let key in data) {
        posts.push(data[key]);
    }
    for (let i = 0; i < posts.length; i++) {
        createCard(posts[i])
    }
}

let url = 'https://pwabackend-a5bf7-default-rtdb.firebaseio.com/posts.json';

let networkDataReceived = false;

if ('caches' in window) {
    caches.match(url)
        .then(result => {
            if (result) {
                return result.json();
            } else {
                return null;
            }
        }).then(data => {
        if (data && !networkDataReceived) {
            clearCards();
            console.log('cache data:', data);
            createCards(data)
            console.log('created by caches!')
        }
    })
}

fetch(url).then(response => {
        networkDataReceived = true;
        return response.json();
    }
).then(data => {
    clearCards();
    createCards(data);
    console.log('created by network!')
})
