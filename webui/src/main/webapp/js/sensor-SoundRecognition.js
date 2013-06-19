/**
 *
 */
//    function voiceDetected()
//    {
//        var speechtext=$("#speech").val();
//        var flag=1;
//        switch (speechtext)
//        {
//            case "chat":
//                $("#chat").click();
//                break;
//            case "video":
//                $("#video").click();
//                break;
//            case "picture":
//                $("#picture").click();
//                break;
//            case "live":
//                $("#live").click();
//                break;
//            case "contact":
//                $("#contact").click();
//                break;
//            default:
//                flag=0;
//                for (i=1;i<=3;i++) $("#speechinput").animate
//                        ({"border-color":"#900"},500).animate
//                        ({"border-color":"#fff"},500);
//        }
//        if (flag==1) for (i=1;i<=3;i++) $("#speechinput").animate
//                ({"border-color":"#060"},500).animate({"border-color":"#fff"},500);
//        else
//        {
//            var notification="\"<span>"+ speechtext + "</span>\" is an invalid voice command.\n*Valid voice commands are: CHAT, VIDEO, PICTURE, LIVE, CONTACT";
//            notify(notification);
//        }
//    }
//    function notify(notification,time)
//    {
//        if (typeof time == 'undefined' ) time = 2000;
//        $("#speechnotification").html(notification);
//        $("#speechnotification").animate({"left":0},1500).delay(time).animate
//                ({"left":-(($(this).width())+5)},1500);
//    }
var select_language;
var select_dialect;
var micStart_button;
var final_span;
var interim_span;
var soundDetectSpan;
// Voice detection (continuous)
var langs =
    [['Afrikaans',       ['af-ZA']],
        ['Bahasa Indonesia',['id-ID']],
        ['Bahasa Melayu',   ['ms-MY']],
        ['Català',          ['ca-ES']],
        ['Čeština',         ['cs-CZ']],
        ['Deutsch',         ['de-DE']],
        ['English',         ['en-AU', 'Australia'],
            ['en-CA', 'Canada'],
            ['en-IN', 'India'],
            ['en-NZ', 'New Zealand'],
            ['en-ZA', 'South Africa'],
            ['en-GB', 'United Kingdom'],
            ['en-US', 'United States']],
        ['Español',         ['es-AR', 'Argentina'],
            ['es-BO', 'Bolivia'],
            ['es-CL', 'Chile'],
            ['es-CO', 'Colombia'],
            ['es-CR', 'Costa Rica'],
            ['es-EC', 'Ecuador'],
            ['es-SV', 'El Salvador'],
            ['es-ES', 'España'],
            ['es-US', 'Estados Unidos'],
            ['es-GT', 'Guatemala'],
            ['es-HN', 'Honduras'],
            ['es-MX', 'México'],
            ['es-NI', 'Nicaragua'],
            ['es-PA', 'Panamá'],
            ['es-PY', 'Paraguay'],
            ['es-PE', 'Perú'],
            ['es-PR', 'Puerto Rico'],
            ['es-DO', 'República Dominicana'],
            ['es-UY', 'Uruguay'],
            ['es-VE', 'Venezuela']],
        ['Euskara',         ['eu-ES']],
        ['Français',        ['fr-FR']],
        ['Galego',          ['gl-ES']],
        ['Hrvatski',        ['hr_HR']],
        ['IsiZulu',         ['zu-ZA']],
        ['Íslenska',        ['is-IS']],
        ['Italiano',        ['it-IT', 'Italia'],
            ['it-CH', 'Svizzera']],
        ['Magyar',          ['hu-HU']],
        ['Nederlands',      ['nl-NL']],
        ['Norsk bokmål',    ['nb-NO']],
        ['Polski',          ['pl-PL']],
        ['Português',       ['pt-BR', 'Brasil'],
            ['pt-PT', 'Portugal']],
        ['Română',          ['ro-RO']],
        ['Slovenčina',      ['sk-SK']],
        ['Suomi',           ['fi-FI']],
        ['Svenska',         ['sv-SE']],
        ['Türkçe',          ['tr-TR']],
        ['български',       ['bg-BG']],
        ['Pусский',         ['ru-RU']],
        ['Српски',          ['sr-RS']],
        ['한국어',            ['ko-KR']],
        ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
            ['cmn-Hans-HK', '普通话 (香港)'],
            ['cmn-Hant-TW', '中文 (台灣)'],
            ['yue-Hant-HK', '粵語 (香港)']],
        ['日本語',           ['ja-JP']],
        ['Lingua latīna',   ['la']]];


function updateCountry() {
    for (var i = select_dialect.options.length - 1; i >= 0; i--) {
        select_dialect.remove(i);
    }
    var list = langs[select_language.selectedIndex];
    for (var i = 1; i < list.length; i++) {
        select_dialect.options.add(new Option(list[i][1], list[i][0]));
    }
    select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;



function micSensorInit() {

    select_language =  document.getElementById('select_language');
    select_dialect =  document.getElementById('select_dialect');
    micStart_button =  document.getElementById('micStart_button');
    final_span  =  document.getElementById('final_span');
    interim_span = document.getElementById('interim_span');
    soundDetectSpan = document.getElementById('soundDetectSpan');

    for (var i = 0; i < langs.length; i++) {
        select_language.options[i] = new Option(langs[i][0], i);
    }
    select_language.selectedIndex = 6;
    updateCountry();
    select_dialect.selectedIndex = 6;


    //if (document.createElement("inputForSpeechTmp").webkitSpeech === undefined) {
//    document.getElementById('errorMessage').innerHTML = 'Sorry. Speech input is not supported in your browser.';
//}

    if (!('webkitSpeechRecognition' in window)) {
        alert('no speech recognition capabilities detected!');
        console.log('no speech recognition capabilities detected!');
    } else {
        micStart_button.style.display = 'inline-block';
        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;


        recognition.onaudiostart = function() {
            console.log('Audio start detect');
        };

        recognition.onaudioend = function() {
            console.log('Audio end detect');
        };

        recognition.onspeechstart = function() {
            console.log('Speech start detect');
        };

        recognition.onspeechstart = function() {
            console.log('Speech start detect');
        };

        recognition.onsoundstart = function() {
            console.log('Sound start detect');
            soundDetectSpan.innerHTML +="[GO]";
        };

        recognition.onsoundend = function() {
            console.log('Sound Ended detect');
            soundDetectSpan.innerHTML +="[STP]";
        };

        recognition.onstart = function() {
            console.log('Recognition session On Start');
            recognizing = true;
        };

        recognition.onerror = function(event) {
            console.log('Recognition on error fired');
            if (event.error == 'no-speech') {
                console.log('no-speech error');
                ignore_onend = true;
            }
            else if (event.error == 'audio-capture') {
                console.log('audio-capture Error');
                ignore_onend = true;
            }
            else if (event.error == 'not-allowed') {
                console.log('not-allowed');
                if (event.timeStamp - start_timestamp < 100) {
                    //showInfo('info_blocked');
                } else {
                    //showInfo('info_denied');
                }
                ignore_onend = true;
            }
            else  if (event.error == 'aborted') {
                console.log('Aborted');
            }
            else  if (event.error == 'network') {
                console.log('network error');
            }
            else  if (event.error == 'service-not-allowed') {
                console.log('service-not-allowed');
            }
            else if (event.error == 'bad-grammar') {
                console.log('bad-grammar');
            }
            else  if (event.error == 'language-not-supported') {
                console.log('language-not-supported');
            }
            else {
                console.log(event.error);
            }


        };

        recognition.onend = function() {
            recognizing = false;
            alert('recognition session Ended');
            console.log('recognition session Ended');
            if (ignore_onend) {
                return;
            }
            //start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
            if (!final_transcript) {
                //showInfo('info_start');
                return;
            }
            //showInfo('');
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                var range = document.createRange();
                range.selectNode(document.getElementById('final_span'));
                window.getSelection().addRange(range);
            }
            //if (create_email) {
            //    create_email = false;
            //    createEmail();
            //}
        };


        recognition.onresult = function(event) {
            console.log('Recognition on result fired');
            var interim_transcript = '';
            if (typeof(event.results) == 'undefined') {
                recognition.onend = null;
                recognition.stop();
                //upgrade();
                alert('Speech detection not supported!' );
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            final_transcript = capitalize(final_transcript);
            final_span.innerHTML = linebreak(final_transcript);
            interim_span.innerHTML = linebreak(interim_transcript);
            if (final_transcript || interim_transcript) {
                //showButtons('inline-block');
            }
        };


        recognition.onnomatch = function(event) {
            console.log('Recongnition no match found');
        };
    }

}


function micStart(event) {

    if(typeof recognition === "undefined" || recognition == null )  {
        alert('Unable to start voice recognition');
        console.log('Unable to start voice recognition');
        return;
    }

    if (recognizing) {
        recognition.stop();
        alert('recognition stopped');
        console.log('recognition stopped');
        return;
    }
    final_transcript = '';
    recognition.lang = select_dialect.value;
    recognition.start();
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    soundDetectSpan.innerHTML = '';
    start_timestamp = event.timeStamp;
    alert('recognition started: ' + start_timestamp);
    console.log('recognition started: ' + start_timestamp);

}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
}
