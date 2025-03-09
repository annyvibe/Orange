let handPose;
let video;
let hands = [];
let orangeVideo;

function preload() {
    handPose = ml5.handPose();
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    let webcam = createCapture(VIDEO);
    webcam.size(windowWidth, windowHeight);
    webcam.hide();

    orangeVideo = createVideo(['assets/Orange.mp4']);
    orangeVideo.size(windowWidth, windowHeight);
    orangeVideo.hide();
    orangeVideo.volume(0);

    handPose.detectStart(webcam, gotHands);

    let startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function () {
        startButton.style.display = 'none';
        startVideo();
    });

    let fullscreenButton = document.createElement('button');
    fullscreenButton.id = 'fullscreenButton';
    fullscreenButton.textContent = 'Enter Fullscreen';
    fullscreenButton.style.position = 'absolute';
    fullscreenButton.style.top = '10px';
    fullscreenButton.style.right = '10px';
    document.body.appendChild(fullscreenButton);

    fullscreenButton.addEventListener('click', function () {
        requestFullScreen();
        fullscreenButton.style.display = 'none';
    });

}
function requestMotionAccess() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleMotion);
                }
            })
            .catch(console.error);
    } else {
        // Handle non-iOS 13+ devices
    }
}

function startVideo() {
    if (orangeVideo && orangeVideo.elt.paused) {
        orangeVideo.loop();
        orangeVideo.volume(1);
    }
}

function touchStarted() {
    if (orangeVideo && orangeVideo.elt.paused) {
        orangeVideo.loop();
        orangeVideo.volume(1);
    }
    return false;
}

function draw() {
    image(orangeVideo, 0, 0, width, height);

    if (hands.length > 0) {
        let finger = hands[0].index_finger_tip;
        let thumb = hands[0].thumb_tip;
        let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);
        let speed = map(pinch, 0, 700, 0.1, 2);
        // console.log(pinch);
        orangeVideo.speed(speed);
    } else {
        orangeVideo.speed(1);
    }
}

function gotHands(results) {
    hands = results;
}

function requestFullScreen() {
    let elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
}