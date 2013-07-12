/**
 * Created with IntelliJ IDEA.
 * User: antoniou
 * Date: 20/06/13
 * Time: 14:11
 * To change this template use File | Settings | File Templates.
 */

o3djs.require('o3djs.shader');

var video;
var context;
var analyser;     //audio analyser
var audioAnalyserView1;
var idx;
var filters = [];

function output(str) {
    console.log(str);
}

/**
 * cross-browser check for User Media support
*/
function hasGetUserMedia() {
    // Note: Opera is unprefixed.
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

/**
 * Chrome specific check for User Media support (because most of the examples and implementations are for Chrome)
 */
navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;
window.URL = window.URL || window.webkitURL;


function hasGetUserMediaChrome() {
    if (!navigator.getUserMedia) {
        output('Sorry. navigator.getUserMedia() is not available.');
        return false;
    }
    return true;
}


// Sample usage:
//if (hasGetUserMedia()) {
//    // Good to go!
//} else {
//    alert('getUserMedia() is not supported in your browser');
//}

function finishAudioVidInJSTest() {
    ;
}

function audioVidInGetError(code) {
    alert('Stream (audio and video) generation failed.');
    output(code);
    finishAudioVidInJSTest();
}

function webcamNoStream(e) {
    var msg = 'No camera available.';
    if (e.code == 1) {
        msg = 'User denied access to use camera.';
    }
    output( msg);
}

function audioVidInGotStream(stream) {
    s = stream;
    context = new webkitAudioContext();

    analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    // Connect audio processing graph:
    // live-input -> analyser -> destination

    // Create an AudioNode from the stream.
    var mediaStreamSource = context.createMediaStreamSource(stream);
    mediaStreamSource.connect(analyser);
    analyser.connect(context.destination);

    window.requestAnimationFrame(draw);
    audioAnalyserView1 = new AnalyserView("audioView");
    audioAnalyserView1.initByteBuffer();
    window.requestAnimationFrame(draw);
    if ( !window.requestAnimationFrame ) {
        window.requestAnimationFrame = ( function() {

            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

                    window.setTimeout( callback, 1000 / 60 );

                };
        } )();
    }


    //
    // webcam video start
    //
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
        //canvas.width = video.videoWidth;
        //canvas.height = video.videoHeight;
        document.getElementById('splash').hidden = true;
        document.getElementById('app').hidden = false;
    }, 50);

    initMotionDetect();

}

function audioAndVideoInChromeInit() {
    app = document.getElementById('app');
    video = document.getElementById('monitor');
    audioAnalyserView1 = new AnalyserView("audioView");
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

    if(hasGetUserMediaChrome() ) {
        try {
            navigator.webkitGetUserMedia({audio:true, video: true}, audioVidInGotStream, audioVidInGetError);
        } catch (e) {
            alert('webkitGetUserMedia threw exception :' + e);
            finishAudioVidInJSTest();
        }
    }

}

function changeFilter(el) {
    el.className = '';
    var effect = filters[idx++ % filters.length];
    if (effect) {
        el.classList.add(effect);
    }
}


    function draw() {
        audioAnalyserView1.doFrequencyAnalysis();
        window.requestAnimationFrame(draw);
    }


function setAudioInAnalysisType(theType)
{
    if(typeof audioAnalyserView1 === "undefined" || audioAnalyserView1 == null )  {
        output("Error: Could not set the analysis visualization type 2")
        return;
    }
    audioAnalyserView1.setAnalysisType(theType);
}

// MOTION DETECTION SECTION (to be moved to a separate javascript!!
// main work from http://www.adobe.com/devnet/html5/articles/javascript-motion-detection.html (TODO attribute credits)
var notesPos = [0, 82, 159, 238, 313, 390, 468, 544]; // TODO to be removed
var timeOut, lastImageData;
var canvasSource = null;
var canvasBlended = null;
var contextSource = null;
var contextBlended = null;
var soundContext, bufferLoader;
var notes = [];
function initMotionDetect()
{
    canvasSource = $("#canvas-source")[0];
    canvasBlended = $("#canvas-blended")[0];
    contextSource = canvasSource.getContext('2d');
    contextBlended = canvasBlended.getContext('2d');
    // mirror video
    contextSource.translate(canvasSource.width, 0);
    contextSource.scale(-1, 1);
    startMotionDetect();
}

function startMotionDetect() {
    notesInit();
    $(canvasSource).show();
    $(canvasBlended).show();
    //$("#xylo").show();
    //$("#message").hide();
    //$("#description").show();
    updateMotionDetect();
}

function notesInit(){
    for (var i=0; i<8; i++) {
        var note = {
            ready: true,
            visual: $("#note" + i)[0]
        };
        //note.area = {x:notesPos[i], y:0, width:note.visual.width, height:100};
        note.area = {x:notesPos[i], y:0, width:10, height:100};
        notes.push(note);
    }
}

function updateMotionDetect() {
    drawVideoMotionDetect();   // ???????
    blendMotionDetect();
    checkAreasMotionDetect(); //???
    timeOut = setTimeout(updateMotionDetect, 15000/60);
}


function drawVideoMotionDetect() {
    contextSource.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
}

function blendMotionDetect() {
    var width = canvasSource.width;
    var height = canvasSource.height;
    // get webcam image data
    var sourceData = contextSource.getImageData(0, 0, width, height);
    // create an image if the previous image doesn’t exist
    if (!lastImageData) lastImageData = contextSource.getImageData(0, 0, width, height);
    // create a ImageData instance to receive the blended result
    var blendedData = contextSource.createImageData(width, height);
    // blend the 2 images
    differenceAccuracy(blendedData.data, sourceData.data, lastImageData.data);
    // draw the result in a canvas
    contextBlended.putImageData(blendedData, 0, 0);
    // store the current webcam image
    lastImageData = sourceData;
}

function fastAbs(value) {
    // funky bitwise, equal Math.abs
    return (value ^ (value >> 31)) - (value >> 31);
}

function threshold(value) {
    return (value > 0x15) ? 0xFF : 0;
}

function difference(target, data1, data2) {
    // blend mode difference
    if (data1.length != data2.length) return null;
    var i = 0;
    while (i < (data1.length * 0.25)) {
        target[4*i] = data1[4*i] == 0 ? 0 : fastAbs(data1[4*i] - data2[4*i]);
        target[4*i+1] = data1[4*i+1] == 0 ? 0 : fastAbs(data1[4*i+1] - data2[4*i+1]);
        target[4*i+2] = data1[4*i+2] == 0 ? 0 : fastAbs(data1[4*i+2] - data2[4*i+2]);
        target[4*i+3] = 0xFF;
        ++i;
    }
}

function differenceAccuracy(target, data1, data2) {
    if (data1.length != data2.length) return null;
    var i = 0;
    while (i < (data1.length * 0.25)) {
        var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
        var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
        var diff = threshold(fastAbs(average1 - average2));
        target[4*i] = diff;
        target[4*i+1] = diff;
        target[4*i+2] = diff;
        target[4*i+3] = 0xFF;
        ++i;
    }
}

function checkAreasMotionDetect() {
    // loop over the note areas
    for (var r=0; r<8; ++r) {
        // get the pixels in a note area from the blended image
        var blendedData = contextBlended.getImageData(notes[r].area.x, notes[r].area.y, notes[r].area.width, notes[r].area.height);
        var i = 0;
        var average = 0;
        // loop over the pixels
        while (i < (blendedData.data.length * 0.25)) {
            // make an average between the color channel
            average += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
            ++i;
        }
        // calculate an average between of the color values of the note area
        average = Math.round(average / (blendedData.data.length * 0.25));
        if (average > 10) {
            // over a small limit, consider that a movement is detected
            // play a note and show a visual feedback to the user
            //playSound(notes[r]); // TODO remove
            //notes[r].visual.style.display = "block";
            //$(notes[r].visual).fadeOut();
            //console.log('Note '+ notes[r])
            console.log('Movement!')
        }
    }
}