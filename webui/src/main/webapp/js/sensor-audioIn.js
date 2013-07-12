o3djs.require('o3djs.shader');

// Events
var context;
var source;
var analyser;
var buffer;
var audioBuffer;

var analyserView1;


function finishAudioInJSTest() {
    ;
}

function audioInGetError(code) {
    alert('Stream generation failed.');
    output(code);
    finishAudioInJSTest();
}

function audioInGetUserMedia(dictionary, callback) {
    try {
        navigator.webkitGetUserMedia(dictionary, callback, audioInGetError);
    } catch (e) {
        alert('webkitGetUserMedia threw exception :' + e);
        finishAudioInJSTest();
    }
}

function audioInGotStream(stream) {
    s = stream;

    analyserView1 = new AnalyserView("audioView");

    initAudio(stream);
    analyserView1.initByteBuffer();

    window.requestAnimationFrame(draw);
}

function audioInStart() {
    if (!navigator.getUserMedia) {
        document.getElementById('errorMessage').innerHTML = 'Sorry. <code>navigator.getUserMedia()</code> is not available.';
        return;
    }
    audioInGetUserMedia({audio:true}, audioInGotStream);
}

function initAudio(stream) {
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
}

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

function setAudioInAnalysisType(theType)
{
    if(typeof analyserView1 === "undefined" || analyserView1 == null )  {
        output("Error: Could not set the analysis visualization type 1")
        return;
    }
    analyserView1.setAnalysisType(theType);
}

function draw() {
    analyserView1.doFrequencyAnalysis();
    window.requestAnimationFrame(draw);
}
