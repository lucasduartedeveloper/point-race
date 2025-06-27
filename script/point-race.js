var uploadAlert = new Audio("audio/ui-audio/upload-alert.wav");
var warningBeep = new Audio("audio/beep.wav");

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

    canvasView = 
    document.createElement("canvas");
    canvasView.style.position = "absolute";
    canvasView.style.left = (0)+"px";
    canvasView.style.top = (0)+"px";
    canvasView.width = (sw);
    canvasView.height = (sh);
    canvasView.style.width = (sw)+"px";
    canvasView.style.height = (sh)+"px";
    canvasView.style.zIndex = "15";
    document.body.appendChild(canvasView);

    fpsView = 
    document.createElement("span");
    fpsView.style.position = "absolute";
    fpsView.innerText = "30";
    fpsView.style.color = "#fff";
    fpsView.style.left = (10)+"px";
    fpsView.style.top = (10)+"px";
    fpsView.style.width = (50)+"px";
    fpsView.style.height = (20)+"px";
    fpsView.style.zIndex = "15";
    //document.body.appendChild(fpsView);

    metersView = 
    document.createElement("span");
    metersView.style.position = "absolute";
    metersView.innerText = "0 m";
    metersView.style.color = "#fff";
    metersView.style.textAlign= "center";
    metersView.style.left = ((sw/2)-25)+"px";
    metersView.style.top = (50)+"px";
    metersView.style.width = (50)+"px";
    metersView.style.height = (20)+"px";
    metersView.style.zIndex = "15";
    document.body.appendChild(metersView);

    rightView = 
    document.createElement("button");
    rightView.style.position = "absolute";
    rightView.innerText = ">";
    rightView.style.color = "#000";
    rightView.style.left = ((sw/2)+25)+"px";
    rightView.style.top = (sh-30)+"px";
    rightView.style.width = (40)+"px";
    rightView.style.height = (30)+"px";
    rightView.style.zIndex = "15";
    document.body.appendChild(rightView);

    rightView.onclick = function() {
        var name = nameView.value;
        if (name == "") return;

        getUser(name, function() {
            user.meters = user.meters + 1;
            metersView.innerText = user.meters+" m";

            updateUser();
        });
    };

    leftView = 
    document.createElement("button");
    leftView.style.position = "absolute";
    leftView.innerText = "<";
    leftView.style.color = "#000";
    leftView.style.left = ((sw/2)-55)+"px";
    leftView.style.top = (sh-30)+"px";
    leftView.style.width = (40)+"px";
    leftView.style.height = (30)+"px";
    leftView.style.zIndex = "15";
    document.body.appendChild(leftView);

    leftView.onclick = function() {
        var name = nameView.value;
        if (name == "") return;

        if (user.meters == 0) return;

        getUser(name, function() {
            user.meters = user.meters - 1;
            metersView.innerText = user.meters+" m";

            updateUser();
        });
    };

    nameView = 
    document.createElement("input");
    nameView.style.position = "absolute";
    nameView.placeholder = "input name";
    nameView.type = "text";
    nameView.value = "";
    nameView.style.color = "#fff";
    nameView.style.textAlign= "center";
    nameView.style.left = ((sw/2)-150)+"px";
    nameView.style.top = (100)+"px";
    nameView.style.width = (100)+"px";
    nameView.style.height = (20)+"px";
    nameView.style.zIndex = "15";
    document.body.appendChild(nameView);

    getUsers();

    window.requestAnimationFrame(animate);
});

var pause = false;

var startTime = new Date().getTime();
var frameCount = 0;
var fps = 0;

var users = [ ];

var user = { id: 0, name: "", meters: 0 };

var animate = function() {
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime-startTime;

    fps = (1000/elapsedTime);
    fpsView.innerText = fps.toFixed(2);

    var canvas = canvasView;
    var ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, sw, sh);

    ctx.strokeStyle = "#555";

    ctx.beginPath();
    ctx.moveTo(0, (sh/2));
    ctx.lineTo(sw, (sh/2));
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";

    if (user.id != 0) {
        ctx.beginPath();
        ctx.arc((sw/2), (sh/2), 5, 0, (Math.PI * 2));
        ctx.fill();
    }

    ctx.font = "12px sans";
    ctx.fillText(user.name, (sw/2), (sh/2)-25);
    //ctx.fillText(user.meters + " m", (sw/2), (sh/2)+25);

    ctx.fillStyle = "#999";

    for (var n = 0; n < users.length; n++) {
        if (users[n].name == user.name)
        continue;

        var x = (sw/2) + (users[n].meters - user.meters);

        ctx.beginPath();
        ctx.arc(x, (sh/2), 5, 0, (Math.PI * 2));
        ctx.fill();

        ctx.fillText(users[n].name, x, (sh/2)-25);
        ctx.fillText(users[n].meters + " m", x, (sh/2)+25);
    };

    startTime = new Date().getTime();

    window.requestAnimationFrame(animate);
};

var getUsers = function() {
    $.ajax({
        url: "ajax/user.php",
        method: "GET",
        datatype: "json"
    })
    .done(function(data, status, xhr) {
        var json = JSON.parse(data);
        users = json;

        if (user.id == 0) {
            var meters = 0;
            for (var n = 0; n < users.length; n++) {
                if (users[n].meters > meters)
                meters = users[n].meters;
            }

            user.meters = meters;
        }
    });
};

var getUser = function(name, callback) {
    $.ajax({
        url: "ajax/user.php?name="+name,
        method: "GET",
        datatype: "json"
    })
    .done(function(data, status, xhr) {
        var json = JSON.parse(data);
        user = json[0];

        callback();
    });
};

var updateUser = function() {
    $.ajax({
        url: "ajax/user.php",
        method: "POST",
        datatype: "json",
        data: { action: "update-user", user: user }
    })
    .done(function(data, status, xhr) {
        
    });
};

var createOscillator = function() {
    // create web audio api context
    var audioCtx = 
    new(window.AudioContext || window. webkitAudioContext)();

    // create Oscillator node
    var oscillator = audioCtx.createOscillator();

    var volume = audioCtx.createGain();
    volume.gain.value = 1;

    var biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "lowpass";
    biquadFilter.frequency.value = 100;

    // Create a stereo panner
    var panNode = audioCtx.createStereoPanner();
    panNode.connect(biquadFilter);

    volume.connect(panNode);

    oscillator.type = "square"; //"sine";
    oscillator.frequency.value = 0; // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.volume = volume;
    oscillator.biquadFilter = biquadFilter;
    oscillator.panNode = panNode;

    return oscillator;
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