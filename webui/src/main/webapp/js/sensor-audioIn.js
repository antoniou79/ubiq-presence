//<!--
//Copyright 2012, Google Inc.
//All rights reserved.
//
//Redistribution and use in source and binary forms, with or without
//modification, are permitted provided that the following conditions are
//met:
//
//    * Redistributions of source code must retain the above copyright
//notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above
//copyright notice, this list of conditions and the following disclaimer
//in the documentation and/or other materials provided with the
//distribution.
//    * Neither the name of Google Inc. nor the names of its
//contributors may be used to endorse or promote products derived from
//this software without specific prior written permission.
//
//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
//"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
//LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
//A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
//OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
//SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
//DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
//THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
//(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
//OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//-->


o3djs.require('o3djs.shader');

function output(str) {
    console.log(str);
}

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
        output("Error: Could not set the analysis visualization type")
        return;
    }
    analyserView1.setAnalysisType(theType);
}

function draw() {
    analyserView1.doFrequencyAnalysis();
    window.requestAnimationFrame(draw);
}
