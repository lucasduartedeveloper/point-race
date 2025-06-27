

//canvas
var canvas= document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);


var helloY=250;



//update
var update = function(modifier){

	helloY +=1;

	if(helloY>520){
		helloY = -10;
	}

};


//draw
var render = function(){

	ctx.fillStyle = "rgb(0,0,100)";
	ctx.fillRect(0,0,640,480);

	ctx.fillStyle = "rgb(255,255,255)";
	ctx.font= "50px Arial";
	ctx.fillText("Hello World!", 200, helloY);

};

//main loop

var main = function(){
	var now = Date.now();
	var delta = now-then;

	update(delta/1000);
	render();

	then = now;

	requestAnimationFrame(main);

};

var w = window;
 
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


//start game

var then=Date.now();
main();