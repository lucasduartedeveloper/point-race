var uploadAlert = new Audio("audio/ui-audio/upload-alert.wav");
var warningBeep = new Audio("audio/warning_beep.wav");

var sw = 360; //window.innerWidth;
var sh = 669; //window.innerHeight;

var gridSize = 10;

if (window.innerWidth > window.innerHeight) {
    sw = window.innerWidth;
    sh = window.innerHeight;
    gridSize = 20;
}

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
if (urlParams.has("height"))
sh = parseInt(urlParams.get("height"));

var audioBot = true;
var playerId = new Date().getTime();

var canvasBackgroundColor = "rgba(255,255,255,1)";
var backgroundColor = "rgba(50,50,65,1)";
var buttonColor = "rgba(75,75,90,1)";

var audioStream = 
new Audio("audio/music/stream-0.wav");

// Botão de gravação
$(document).ready(function() {
    $("html, body").css("overscroll-behavior", "none");
    $("html, body").css("overflow", "hidden");
    $("html, body").css("background", "#000");

    $("#title").css("font-size", "15px");
    $("#title").css("color", "#fff");
    $("#title").css("top", "10px");
    $("#title").css("z-index", "25");

    // O outro nome não era [  ]
    // Teleprompter
    $("#title")[0].innerText = ""; //"PICTURE DATABASE"; 
    $("#title")[0].onclick = function() {
        var text = prompt();
        sendText(text);
    };

    tileSize = (sw/7);

    document.body.style.overflowX = "scroll";

    var rnd = Math.floor(Math.random()*360);

    containerView = document.createElement("button");
    containerView.style.position = "absolute";
    containerView.style.background = "#000";
    containerView.style.color = "#fff";
    containerView.style.fontSize = "72px";
    containerView.width = (sw/2);
    containerView.height = (sw/2); 
    containerView.style.left = ((sw/2)-(sw/4))+"px";
    containerView.style.top = ((sh/2)-(sw/4))+"px";
    containerView.style.width = (sw/2)+"px";
    containerView.style.height = (sw/2)+"px";
    containerView.style.border = "0px";
    containerView.style.zIndex = "15";
    document.body.appendChild(containerView);

    animate();
});

var colors = [ "#FF3333", "#FFFF00", "#33CC33" ];

var animate = function() {
    var count = 0;
    var numbers = [];
    for (var n = 1; n < 100; n++) {
        numbers.push(n);
    }

    var interval = setInterval(function() {
        //containerView.style.background = colors[count];

        var n = Math.random()*numbers.length;
        var nf = Math.floor(n);

        var result = numbers.splice(n, 1);
        var number = result[0];

        containerView.innerText = number;

        count += 1;
        if (count > 2) count = 0;
    }, 5000);
};

// 100 0-0.99 0.95 

var visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  visibilityChange = "webkitvisibilitychange";
}
//^different browsers^

var backgroundMode = false;
document.addEventListener(visibilityChange, function(){
    backgroundMode = !backgroundMode;
    if (backgroundMode) {
        console.log("backgroundMode: "+backgroundMode);
    }
    else {
        console.log("backgroundMode: "+backgroundMode);
    }
}, false);