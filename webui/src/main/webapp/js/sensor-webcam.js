/**
 */
navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;
window.URL = window.URL || window.webkitURL;

var app;
var video;
var canvas;
var effect;
var gallery;
var ctx;
var intervalId;
var idx;
var filters = [];

function changeFilter(el) {
    el.className = '';
    var effect = filters[idx++ % filters.length];
    if (effect) {
        el.classList.add(effect);
    }
}

function webCamGotStream(stream) {
    if (window.URL) {
        video.src = window.URL.createObjectURL(stream);
    } else {
        video.src = stream; // Opera.
    }

    video.onerror = function(e) {
        stream.stop();
    };

    stream.onended = webcamNoStream;

    video.onloadedmetadata = function(e) { // Not firing in Chrome. See crbug.com/110938.
        document.getElementById('splash').hidden = true;
        document.getElementById('app').hidden = false;
    };

    // Since video.onloadedmetadata isn't firing for getUserMedia video, we have
    // to fake it.
    setTimeout(function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        document.getElementById('splash').hidden = true;
        document.getElementById('app').hidden = false;
    }, 50);
}

function webcamNoStream(e) {
    var msg = 'No camera available.';
    if (e.code == 1) {
        msg = 'User denied access to use camera.';
    }
    document.getElementById('errorMessage').textContent = msg;
}

function capture() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        return;
    }

    intervalId = setInterval(function() {
        ctx.drawImage(video, 0, 0);
        var img = document.createElement('img');
        img.src = canvas.toDataURL('image/webp');

        var angle = Math.floor(Math.random() * 36);
        var sign = Math.floor(Math.random() * 2) ? 1 : -1;
        img.style.webkitTransform = 'rotateZ(' + (sign * angle) + 'deg)';

        var maxLeft = document.body.clientWidth;
        var maxTop = document.body.clientHeight;

        img.style.top = Math.floor(Math.random() * maxTop) + 'px';
        img.style.left = Math.floor(Math.random() * maxLeft) + 'px';

        gallery.appendChild(img);
    }, 150);
}

function webcamSensorInit() {
    app = document.getElementById('app');
    video = document.getElementById('monitor');
    canvas = document.getElementById('photo');
    effect = document.getElementById('effect');
    gallery = document.getElementById('gallery');
    ctx = canvas.getContext('2d');
    intervalId = null;
    idx = 0;
    filters = [
        'grayscale',
        'sepia',
        'blur',
        'brightness',
        'contrast',
        'hue-rotate', 'hue-rotate2', 'hue-rotate3',
        'saturate',
        'invert',
        ''
    ];
}

function webcamStart(el) {
    if (!navigator.getUserMedia) {
        document.getElementById('errorMessage').innerHTML = 'Sorry. <code>navigator.getUserMedia()</code> is not available.';
        return;
    }

    el.onclick = capture;
    el.textContent = 'Snapshot';
    navigator.getUserMedia({video: true}, webCamGotStream, webcamNoStream);
}

window.addEventListener('keydown', function(e) {
    if (e.keyCode == 27) { // ESC
        document.querySelector('details').open = false;
    }
}, false);
