<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon"
          href="<%=request.getContextPath()%>/img/favicon2.ico"
          type="image/x-icon" />
    <link href="<%=request.getContextPath()%>/css/bootstrap.css"
          rel="stylesheet">
    <script type="text/javascript"
            src="<%=request.getContextPath()%>/js/jquery-1.9.1.js"></script>
    <script type="text/javascript"
            src="<%=request.getContextPath()%>/js/bootstrap.js"></script>
    <title>Testing capturing user input</title>


    <style>
        @-webkit-keyframes glowRed {
  from {
    box-shadow: rgba(255, 0, 0, 0) 0 0 0;
  }
  50% {
    box-shadow: rgba(255, 0, 0, 1) 0 0 15px 1px;
  }
  to {
    box-shadow: rgba(255, 0, 0, 0) 0 0 0;
  }
}
        html, body {
            overflow: hidden;
            margin: 0;
            padding: 0;
        }
        body {
            display: -webkit-flex;
            -webkit-align-items: center;
            -webkit-justify-content: center;
            box-sizing: border-box;
        }
        article {
            text-align: center;
        }
        #monitor {
            /*-webkit-transform: scaleX(-1);*/
            height: 300px;
            /*-webkit-box-reflect: below 20px -webkit-linear-gradient(top, transparent, transparent 80%, rgba(255,255,255,0.2));*/
        }
        #live {
            position: absolute;
            z-index: 1;
            color: white;
            font-weight: 600;
            font-family: Arial;
            font-size: 16pt;
            right: 35px;
            top: 20px;
            text-shadow: 1px 1px red;
            letter-spacing: 1px;
        }
        #live:before {
            content: '';
            border-radius: 50%;
            width: 15px;
            height: 15px;
            background: red;
            position: absolute;
            left: -20px;
            margin-top: 5px;
        }
        #gallery img {
            position: absolute;
            z-index: -1;
            height: 75px;
        }
        #gallery img {
            float: left;
            height: 75px;
        }
        .container {
            padding: 10px 25px 5px 25px;
            background: black;
            border-radius: 4px;
            display: inline-block;
            position: relative;
        }
        h1 {
            font-weight: 300;
        }
        .blur {
            -webkit-filter: blur(3px);
        }
        .brightness {
            -webkit-filter: brightness(5);
        }
        .contrast {
            -webkit-filter: contrast(8);
        }
        .hue-rotate {
            -webkit-filter: hue-rotate(90deg);
        }
        .hue-rotate2 {
            -webkit-filter: hue-rotate(180deg);
        }
        .hue-rotate3 {
            -webkit-filter: hue-rotate(270deg);
        }
        .saturate {
            -webkit-filter: saturate(10);
        }
        .grayscale {
            -webkit-filter: grayscale(1);
        }
        .sepia {
            -webkit-filter: sepia(1);
        }
        .invert {
            -webkit-filter: invert(1)
        }

        #speechinput input {
            cursor:pointer;
            margin:auto;
            margin:15px;
            color:transparent;
            background-color:transparent;
            border:5px;
            width:15px;
            -webkit-transform: scale(3.0, 3.0);
            -moz-transform: scale(3.0, 3.0);
            -ms-transform: scale(3.0, 3.0);
            transform: scale(3.0, 3.0);
        }

    </style>

</head>
<body>
<details>
    <summary>What's this?</summary>
    <div>
        <p>Example of the <a href="http://dev.w3.org/2011/webrtc/editor/getusermedia.html" target="_blank" title="Spec link" alt="Spec link"><code>navigator.getUserMedia()</code></a>
            API for capturing audio and video, sans plugin. This demo also shows the video being rendered
            to while <a href="/static/css/filters/index.html">CSS filters</a> are applied in realtime (click the video).</p>
        <p><b>Support:</b> Chrome 18.0.1009.0 with the <code>--enable-media-stream</code> flag set. Chrome 20.0.1125.0 changed
            the method signature to the updated spec: <code>getUserMedia({video: true})</code></p>
    </div>
</details>

<article>
    <h1>CSS Filters Photobooth</h1>
    <section id="app" hidden>
        <div class="container"><span id="live">LIVE</span><video id="monitor" autoplay onclick="changeFilter(this)" title="Click me to see different filters"></video></div>
        <p>Click the video to see different CSS filters</p>
        <p>
        <div id="speechinput" >
            <input type="text" x-webkit-speech id="voiceInput" speech required onspeechchange="voiceDetected()" onwebkitspeechchange="voiceDetected();"  />
        </div>
        </p>
    </section>

    <p><button onclick="init(this)">Capture</button></p>
    <div id="splash">
        <p id="errorMessage">&uarr;<br>Click to begin</p>
    </div>
    <div id="gallery"></div>
</article>
<canvas id="photo" style="display:none"></canvas>
<script type="text/javascript">
    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;
    window.URL = window.URL || window.webkitURL;

    var app = document.getElementById('app');
    var video = document.getElementById('monitor');
    var canvas = document.getElementById('photo');
    var effect = document.getElementById('effect');
    var gallery = document.getElementById('gallery');
    var ctx = canvas.getContext('2d');
    var intervalId = null;
    var idx = 0;
    var filters = [
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

    function changeFilter(el) {
        el.className = '';
        var effect = filters[idx++ % filters.length];
        if (effect) {
            el.classList.add(effect);
        }
    }

    function gotStream(stream) {
        if (window.URL) {
            video.src = window.URL.createObjectURL(stream);
        } else {
            video.src = stream; // Opera.
        }

        video.onerror = function(e) {
            stream.stop();
        };

        stream.onended = noStream;

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

    function noStream(e) {
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

    function init(el) {
        if (!navigator.getUserMedia) {
            document.getElementById('errorMessage').innerHTML = 'Sorry. <code>navigator.getUserMedia()</code> is not available.';
            return;
        }

        if (document.createElement("inputForSpeechTmp").webkitSpeech === undefined) {
            document.getElementById('errorMessage').innerHTML = 'Sorry. Speech input is not supported in your browser.';
        }

        el.onclick = capture;
        el.textContent = 'Snapshot';
        navigator.getUserMedia({video: true}, gotStream, noStream);
    }

    window.addEventListener('keydown', function(e) {
        if (e.keyCode == 27) { // ESC
            document.querySelector('details').open = false;
        }
    }, false);

    function voiceDetected()
    {
        var speechtext=$("#speech").val();
        var flag=1;
        switch (speechtext)
        {
            case "chat":
                $("#chat").click();
                break;
            case "video":
                $("#video").click();
                break;
            case "picture":
                $("#picture").click();
                break;
            case "live":
                $("#live").click();
                break;
            case "contact":
                $("#contact").click();
                break;
            default:
                flag=0;
                for (i=1;i<=3;i++) $("#speechinput").animate
                        ({"border-color":"#900"},500).animate
                        ({"border-color":"#fff"},500);
        }
        if (flag==1) for (i=1;i<=3;i++) $("#speechinput").animate
                ({"border-color":"#060"},500).animate({"border-color":"#fff"},500);
        else
        {
            var notification="\"<span>"+ speechtext + "</span>\" is an invalid voice command.\n*Valid voice commands are: CHAT, VIDEO, PICTURE, LIVE, CONTACT";
            notify(notification);
        }
    }
    function notify(notification,time)
    {
        if (typeof time == 'undefined' ) time = 2000;
        $("#speechnotification").html(notification);
        $("#speechnotification").animate({"left":0},1500).delay(time).animate
                ({"left":-(($(this).width())+5)},1500);
    }

</script>

</body>
</html>