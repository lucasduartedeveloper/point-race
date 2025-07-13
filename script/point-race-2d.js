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

    document.body.style.overflow = "hidden";

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
    metersView.style.left = ((sw/2)-50)+"px";
    metersView.style.top = (50)+"px";
    metersView.style.width = (100)+"px";
    metersView.style.height = (20)+"px";
    metersView.style.zIndex = "15";
    document.body.appendChild(metersView);

    coinsView = 
    document.createElement("span");
    coinsView.style.position = "absolute";
    coinsView.innerText = "coins: 0";
    coinsView.style.color = "#fff";
    coinsView.style.textAlign= "right";
    coinsView.style.left = (sw-110)+"px";
    coinsView.style.top = (50)+"px";
    coinsView.style.width = (100)+"px";
    coinsView.style.height = (20)+"px";
    coinsView.style.zIndex = "15";
    document.body.appendChild(coinsView);

    nameView = 
    document.createElement("input");
    nameView.style.position = "absolute";
    nameView.placeholder = "input name";
    nameView.type = "text";
    nameView.value = "";
    nameView.style.background = "#000";
    nameView.style.color = "#fff";
    nameView.style.textAlign= "center";
    nameView.style.left = ((sw/2)-150)+"px";
    nameView.style.top = (100)+"px";
    nameView.style.width = (100)+"px";
    nameView.style.height = (20)+"px";
    nameView.style.zIndex = "15";
    document.body.appendChild(nameView);

    scoreView = 
    document.createElement("div");
    scoreView.style.position = "absolute";
    scoreView.innerHTML = "";
    scoreView.style.background = "#000";
    scoreView.style.color = "#fff";
    scoreView.style.textAlign = "left";
    scoreView.style.left = (sw-110)+"px";
    scoreView.style.top = (100)+"px";
    scoreView.style.width = (100)+"px";
    scoreView.style.height = (100)+"px";
    //scoreView.style.border = "1px solid #fff";
    scoreView.style.zIndex = "15";
    document.body.appendChild(scoreView);

    getUsers();

    analogAngle = 0;
    analogX = 0;
    analogY = 0;
    analogStart = false;

    var ontouchstart = function(e) {
        var clientX = 0;
        var clientY = 0;

        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        if (clientX > ((sw/2)-50) && 
        clientX < ((sw/2)+50) && 
        clientY > (sh-150) && 
        clientY < (sh-50))
        analogStart = true;

        var diffX = clientX - (sw/2);
        var diffY = clientY - (sh-100);

        var a = _angle2d(diffX, diffY);
        var hyp = 
        Math.sqrt(
        Math.pow(Math.abs(diffX),2)+
        Math.pow(Math.abs(diffY),2));

        var hn = hyp > 40 ? 1 : (1/40)*hyp;

        var c = { x: 0, y: 0 };
        var p = { x: 0, y: -hn };

        var deg = (180/Math.PI) * a;
        var v = _rotate2d(c, p, deg);

        if ((diffX > 0 && v.x < 0) || 
        (diffX < 0 && v.x > 0)) {
            var degFix = -deg;
            v = _rotate2d(c, p, degFix);
        }

        analogAngle = deg;
        analogX = v.x;
        analogY = v.y;
    };

    var ontouchmove = function(e) {
        if (!analogStart) return;

        var clientX = 0;
        var clientY = 0;

        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        var diffX = clientX - (sw/2);
        var diffY = clientY - (sh-100);

        var a = _angle2d(diffX, diffY);
        var hyp = 
        Math.sqrt(
        Math.pow(Math.abs(diffX),2)+
        Math.pow(Math.abs(diffY),2));

        var hn = hyp > 40 ? 1 : (1/40)*hyp;

        var c = { x: 0, y: 0 };
        var p = { x: 0, y: -hn };

        var deg = (180/Math.PI) * a;
        var v = _rotate2d(c, p, deg);

        if ((diffX > 0 && v.x < 0) || 
        (diffX < 0 && v.x > 0)) {
            var degFix = -deg;
            v = _rotate2d(c, p, degFix);
        }

        analogX = parseFloat(v.x.toFixed(2));
        analogY = parseFloat(v.y.toFixed(2));
        analogAngle = deg;
    };

    var ontouchend = function(e) {
        analogX = 0;
        analogY = 0;
        analogStart = false;
    };

    canvasView.ontouchstart = ontouchstart;
    canvasView.ontouchmove = ontouchmove;
    canvasView.ontouchend = ontouchend;

    canvasView.onmousedown = ontouchstart;
    canvasView.onmousemove = ontouchmove;
    canvasView.onmouseup = ontouchend;

    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "update") {
            getUsers();
        }
    };

    loadImages();

    getCoins();

    for (var n = 0; n < objects.length; n++) {
       var angle = objects[n].angle;

       var c = { x: 0, y: 0 };
       var p = { x: 0, y: -1 };
       var v = _rotate2d(c, p, 45);

       if (v.x < 0)
       angle = -angle;

       var c = { x: 1550, y: 0 };
       var p = { x: objects[n].x, y: objects[n].y };
       var pos = _rotate2d(c, p, angle);

       objects[n].x = pos.x;
       objects[n].y = pos.y;
    }

    window.requestAnimationFrame(animate);
});

var coins = [];

var imagesLoaded = false;

var imgList = [
    { path: "img/rocket.png", elem: 0 },
    { path: "img/earth.png", elem: 0 },
    { path: "img/mercury.png", elem: 0 },
    { path: "img/venus.png", elem: 0 },
    { path: "img/mars.png", elem: 0 },
    { path: "img/jupiter.png", elem: 0 },
    { path: "img/saturn.png", elem: 0 },
    { path: "img/uranus.png", elem: 0 },
    { path: "img/neptune.png", elem: 0 },
    { path: "img/pluto.png", elem: 0 },
    { path: "img/sun.png", elem: 0 },
    { path: "img/coin.png", elem: 0 }
];

var loadImages = function() {
    var count = 0;

    for (var n = 0; n < imgList.length; n++) {
        var img = new Image();
        img.n = n;
        img.onload = function(e) {
            count = count + 1;
            imgList[this.n].elem = this;

            console.log("loaded "+
            imgList[this.n].path);

            if (count == imgList.length) {
                imagesLoaded = true;
            }
        }.bind(img);
        img.src = imgList[n].path;
    }
};

var databaseReady = true;

var startTime = new Date().getTime();
var frameCount = 0;
var fps = 0;

var objects = [
    { name: "Earth", x: -100, y: 0, 
    width: 64, height: 64, angle: 0, imgNo: 1 },
    { name: "Mercury", x: 550, y: 0, 
    width: 60, height: 60, angle: 225, imgNo: 2 },
    { name: "Venus", x: 300, y: 0, 
    width: 64, height: 64, angle: 100, imgNo: 3 },
    { name: "Mars", x: -350, y: 0, 
    width: 70, height: 70, angle: 265, imgNo: 4 },
    { name: "Jupiter", x: -550, y: 0, 
    width: 64, height: 64, angle: 350, imgNo: 5 },
    { name: "Saturn", x: -850, y: 0, 
    width: 130, height: 70, angle: 95, imgNo: 6 },
    { name: "Uranus", x: -1100, y: 0, 
    width: 90, height: 50, angle: 30, imgNo: 7 },
    { name: "Neptune", x: -1300, y: 0, 
    width: 50, height: 50, angle: 90, imgNo: 8 },
    { name: "Pluto", x: -1550, y: 0, 
    width: 50, height: 50, angle: 135, imgNo: 9 },
    { name: "Sun", x: 800, y: 0, 
    width: 70, height: 70, angle: 0, imgNo: 10 }
];

var updateCoins = false;
var userUpdated = false;

var users = [ ];

var user = { id: 0, name: "", x: 0, y: 0, angle: 0, coins: 0 };

var animate = function() {
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime-startTime;

    fps = (1000/elapsedTime);
    fpsView.innerText = fps.toFixed(2);

    var canvas = canvasView;
    var ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, sw, sh);

    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "#555";
    ctx.fillStyle = "#555";

    ctx.save();
    ctx.translate(-user.x, -user.y);

    ctx.beginPath();
    ctx.arc((sw/2), (sh/2), 1, 0, (Math.PI * 2));
    ctx.fill();

    var meters = Math.sqrt(
    Math.pow(Math.abs(user.x),2)+
    Math.pow(Math.abs(user.y),2));

    metersView.innerText = 
    meters.toFixed(2)+" m";

    coinsView.innerText = "coins: "+user.coins;

    for (var n = 0; n < objects.length; n++) {
        if (imagesLoaded)
        ctx.drawImage(
        imgList[objects[n].imgNo].elem, 
        (sw/2)+objects[n].x-(objects[n].width/2), 
        (sh/2)+objects[n].y-(objects[n].height/2), 
        objects[n].width, objects[n]. height);

        ctx.fillText(objects[n].name, 
        ((sw/2)+objects[n].x), 
        ((sh/2)+objects[n].y)+
        (objects[n].height/2)+25);

        var co = 
        Math.abs(objects[n].x-800);
        var ca = 
        Math.abs(objects[n].y);
        var hyp = Math.sqrt(
        Math.pow(co, 2), 
        Math.pow(ca, 2));
    }

    var removeCoins = [];

    for (var n = 0; n < coins.length; n++) {
        if (imagesLoaded)
        ctx.drawImage(imgList[11].elem, 
        (sw/2)+coins[n].x-16, 
        (sh/2)+coins[n].y-16, 32, 32);

        var diffX = coins[n].x-user.x;
        var diffY = coins[n].y-user.y;

        var co = Math.abs(diffX);
        var ca = Math.abs(diffY);

        var hyp = Math.sqrt(
        Math.pow(co, 2) + 
        Math.pow(ca, 2));

        if (hyp < 100) {
            //console.log(user, coins[n], hyp);
            ctx.beginPath();
            ctx.arc((sw/2)+coins[n].x, 
            (sh/2)+coins[n].y, 
            16, 0, (Math.PI * 2));
            ctx.stroke();
        }

        if (hyp < 10)
        removeCoins.push(n);
    }

    for (var n = 0; n < removeCoins.length; n++) {
        user.coins = user.coins + 1;
        var coin = 
        coins.splice(removeCoins[n], 1)[0];
        deleteCoin(coin, function() {
            getCoins();
        });
        updateCoins = true;
    }

    for (var n = 0; n < users.length; n++) {
        if (users[n].name == user.name)
        continue;

        ctx.beginPath();
        //ctx.arc(((sw/2)+users[n].x), 
        //((sh/2)+users[n].y), 5, 0, (Math.PI * 2));
        ctx.fill();

        ctx.save();
        ctx.translate(((sw/2)+users[n].x), 
        ((sh/2)+users[n].y));

        ctx.rotate(users[n].angle * (Math.PI/180));

        if (imagesLoaded)
        ctx.drawImage(imgList[0].elem, 
        -16, -16, 32, 32);

        ctx.restore();

        ctx.fillText(users[n].name, 
        ((sw/2)+users[n].x), ((sh/2)+users[n].y)-25);

        var hyp = Math.sqrt(
        Math.pow(Math.abs(users[n].x),2)+
        Math.pow(Math.abs(users[n].y),2));

        ctx.fillText(hyp.toFixed(2)+" m", 
        ((sw/2)+users[n].x), 
        ((sh/2)+users[n].y)+25);

        ctx.fillText(users[n].coins+" coins", 
        ((sw/2)+users[n].x), 
        ((sh/2)+users[n].y)+40);
    };

    ctx.restore();

    ctx.fillStyle = "#fff";

    if (user.id != 0) {
        ctx.beginPath();
        //ctx.arc((sw/2), (sh/2), 5, 0, (Math.PI * 2));
        ctx.fill();

        ctx.save();
        ctx.translate((sw/2), (sh/2));
        ctx.rotate(user.angle * (Math.PI/180));

        if (imagesLoaded)
        ctx.drawImage(imgList[0].elem, 
        -16, -16, 32, 32);

        ctx.restore();

        ctx.fillText(user.name, (sw/2), (sh/2)-25);

        user.x = user.x + analogX;
        user.y = user.y + analogY;
        user.angle = analogAngle;
    }

    startTime = new Date().getTime();

    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";

    ctx.beginPath();
    ctx.arc((sw/2), (sh-100), 50, 0, (Math.PI * 2));
    ctx.stroke();

    ctx.beginPath();
    ctx.arc((sw/2)+(analogX*40), 
    (sh-100)+(analogY*40), 10, 0, (Math.PI * 2));
    ctx.fill();

    database: {
    if (databaseReady) {
        if (user.name != nameView.value)
        userUpdated = false;

        var name = nameView.value;
        if (name == "") 
        break database;

        if (analogX == 0 && analogY == 0 && 
        !updateCoins)
        break database;

        databaseReady = false;
        if (!userUpdated) {
            getUser(name, function() {
                /*
                user.x = user.x + analogX;
                user.y = user.y + analogY;
                user.angle = analogAngle;*/

                userUpdated = true;
                getUsers();

                databaseReady = true;
            });
        }
        else {
            updateUser(function() {
                ws.send("PAPER|"+
                playerId+"|update");
                databaseReady = true;

                if (updateCoins)
                getUsers();

                updateCoins = false;
            });
        }
    }
    }

    window.requestAnimationFrame(animate);
};

var getUsers = function() {
    $.ajax({
        url: "ajax/user_2d.php",
        method: "GET",
        datatype: "json"
    })
    .done(function(data, status, xhr) {
        var json = JSON.parse(data);
        users = json;

        var score = users.toSorted(function(a, b) {
           if (a.coins > b.coins)
           return -1;
           if (a.coins < b.coins)
           return 1;
           if (a.coins == b.coins)
           return 0;
        });

        var length = 3;

        if (score.length < length)
        length = score.length;

        var text = "<b>TOP 3</b><br>";
        for (var n = 0; n < length; n++) {
            text = text + 
            score[n].name+": "+score[n].coins + 
            "<br>";
        }

        scoreView.innerHTML = text;

        /*
        if (user.id == 0 && users.length > 0) {
            var x = 0;
            var y = 0;
            var meters = 0;

            for (var n = 0; n < users.length; n++) {
                var hyp = Math.sqrt(
                Math.pow(Math.abs(users[n].x),2)+
                Math.pow(Math.abs(users[n].y),2));

                if (hyp > meters) {
                    x = users[n].x;
                    y = users[n].y;
                    meters = hyp;
                }
            }

            user.x = x;
            user.y = y;
            user.angle = analogAngle;
        }*/
    });
};

var getUser = function(name, callback) {
    $.ajax({
        url: "ajax/user_2d.php?name="+name,
        method: "GET",
        datatype: "json"
    })
    .done(function(data, status, xhr) {
        var json = JSON.parse(data);
        user = json[0];

        callback();
    });
};

var getCoins = function(name, callback) {
    $.ajax({
        url: "ajax/coin.php",
        method: "GET",
        datatype: "json"
    })
    .done(function(data, status, xhr) {
        var json = JSON.parse(data);
        coins = json;

        if (callback)
        callback();
    });
};

var deleteCoin = function(coin, callback) {
    $.ajax({
        url: "ajax/coin.php",
        method: "POST",
        datatype: "json",
        data: { action: "delete-coin", coin: coin }
    })
    .done(function(data, status, xhr) {
        if (callback)
        callback();
    });
};

var updateUser = function(callback) {
    $.ajax({
        url: "ajax/user_2d.php",
        method: "POST",
        datatype: "json",
        data: { action: "update-user", user: user }
    })
    .done(function(data, status, xhr) {
        callback();
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
