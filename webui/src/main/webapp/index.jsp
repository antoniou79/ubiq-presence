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
    <link href="<%=request.getContextPath()%>/css/common.css"
          rel="stylesheet">
    <script type="text/javascript"
            src="<%=request.getContextPath()%>/js/jquery-1.9.1.js"></script>
    <script type="text/javascript"
            src="<%=request.getContextPath()%>/js/bootstrap.js"></script>
    <script type="text/javascript"
            src="<%=request.getContextPath()%>/js/sensor-webcam.js"></script>
    <script type="text/javascript"
            src="<%=request.getContextPath()%>/js/sensor-mic.js"></script>
    <script type="text/javascript"
            src="<%=request.getContextPath()%>/js/sensor-mouse.js"></script>
    <script type="text/javascript"
            src="<%=request.getContextPath()%>/js/sensor-keyboard.js"></script>

    <title>Testing capturing user input</title>
    <script>
        (function(e, p){
            var m = location.href.match(/platform=(win8|win|mac|linux|cros)/);
            e.id = (m && m[1]) ||
                    (p.indexOf('Windows NT 6.2') > -1 ? 'win8' : p.indexOf('Windows') > -1 ? 'win' : p.indexOf('Mac') > -1 ? 'mac' : p.indexOf('CrOS') > -1 ? 'cros' : 'linux');
            e.className = e.className.replace(/\bno-js\b/,'js');
        })(document.documentElement, window.navigator.userAgent)
    </script>
</head>
<body onload="initSensors();">
<details style='display: none'>
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
    <%--<h1>CSS Filters Test</h1>--%>
    <section id="app" hidden>
        <div class="container">
            <span id="live">ON</span><video id="monitor" autoplay onclick="changeFilter(this)" title="Click to see different filters"></video>
        </div>
        <%--<p>Click the video to see different CSS filters</p>--%>

    </section>

    <p><button id="webcamStart_button" onclick="webcamStart(this)">Webcam Capture</button></p>
    <div id="splash">
        <p id="errorMessage">
            <%--&uarr;<br>Click to begin--%>
        </p>
    </div>
    <p>
        <%--<div id="speechinput" >--%>
        <%--<input type="text" x-webkit-speech id="voiceInput" speech required onspeechchange="voiceDetected()" onwebkitspeechchange="voiceDetected();"  />--%>
        <%--</div>--%>
    <div class="compact marquee">
        <div id="div_start">
            <button id="micStart_button" onclick="micStart(event)" >Mic Capture</button>
        </div>
    </div>
    <div id="results">
        <span id="final_span" class="final"></span>
        <span id="interim_span" class="interim"></span>
        <p>
        <span id="soundDetectSpan" class="interim"></span>
        <p>
    </div>
    <div class="compact marquee" id="div_language">
        <select id="select_language" onchange="updateCountry()">
        </select>&nbsp;&nbsp; <select id="select_dialect">
    </select>
    </div>
    </p>
    <div id="gallery"></div>
</article>
<canvas id="photo" style="display:none"></canvas>

<script>
    function initSensors(){
        micSensorInit();
        webcamSensorInit();
    }
</script>


</body>
</html>