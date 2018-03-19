$(document).ready(function(){
	main();
});

function main(){
	$('div').css({
		"-moz-user-select": "-moz-none",
		"-khtml-user-select": "none",
		"-webkit-user-select": "none",
		"-o-user-select": "none",
		"user-select": "none"
	});

}

var canvas=document.getElementById("myCanvas");
var width=canvas.width;
var height=canvas.height;
var context=canvas.getContext("2d");

function startGame(){
	context.fillStyle="#424242";
	context.fillRect(0,0,width,height);
	var bar=new Image();
	bar.onload = function(){
		context.drawImage(bar,0,0,3*width/4,height);
	}
	bar.src="images/BarBackground.jpg";
	context.fillStyle="#FFEB3B";
	context.font="32px Impact";
	context.textAlign="center";
	context.fillText("Drinking and Driving\nSimulator",7*width/8,height/8);

	var startButton={
		x:7*width/8,
		y: 2*height/4,
		width: width/10,
		height: height/10,
		text: "Start Game"
	}

	var helpButton={
		x:7*width/8,
		y: 5*height/8,
		width: width/10,
		height: height/10,
		text: "Help"
	}

	var creditsButton={
		x:7*width/8,
		y: 3*height/4,
		width: width/10,
		height: height/10,
		text: "Credits"
	}

	//Start Button
	context.strokeStyle="#FFEB3B";
	context.textBaseline="middle";
	context.lineWidth="4";
	context.strokeRect(startButton.x-startButton.width/2,startButton.y,startButton.width,startButton.height);
	context.fillText(startButton.text,startButton.x,startButton.y+startButton.height/2);

	//Help Button
	context.strokeRect(helpButton.x-helpButton.width/2,helpButton.y,helpButton.width,helpButton.height);
	context.fillText(helpButton.text,helpButton.x,helpButton.y+helpButton.height/2);

	//Credits Button
	context.strokeRect(creditsButton.x-creditsButton.width/2,creditsButton.y,creditsButton.width,creditsButton.height);
	context.fillText(creditsButton.text,creditsButton.x,creditsButton.y+creditsButton.height/2);
	
	canvas.addEventListener("click",menuClickListener,false);

	function menuClickListener(evt){
		var mousePos=getMousePos(canvas,evt);
		if(isInside(mousePos,startButton)){
			playGame();
			canvas.removeEventListener("click",menuClickListener);
		}
		else if(isInside(mousePos,helpButton)){
			alert("help");
		}
		else if(isInside(mousePos,creditsButton)){
			alert("credits");
		}
	}
}

//Code Snippet from StackOverflow user K3N: https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
//Function to get the mouse position
function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect(), // abs. size of element
	scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
	scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
	return {
		x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
		y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
	}
}

//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
	//alert(pos.x+","+pos.y+"  \n"+(rect.x-rect.width/2)+","+rect.y);
	return pos.x > (rect.x-rect.width/2) && pos.x < rect.x+rect.width/2 && pos.y < rect.y+rect.height && pos.y > rect.y
}

function playGame(){
	var bac=0.0;
	drawMenu(true);
	
	function drawMenu(drawBar){
		if(drawBar){
			context.clearRect(0, 0, canvas.width, canvas.height);
			var bar=new Image();
			var barLoaded=false;
			bar.onload = function(){
				context.drawImage(bar,0,0,3*width/4,height);
				barLoaded=true;
			}
			bar.src="images/BarBackground.jpg";
			canvas.addEventListener("click",gameClickListener,false);
		}
		else{
			context.clearRect(3*width/4, 0, canvas.width/4, canvas.height);
		}
		
		context.fillStyle="#424242";
		context.fillRect(3*width/4,0,width/4,height);

		context.font="48px Impact";
		context.textAlign="center";
		context.textBaseline="middle";
		context.fillStyle="#FFEB3B";
		context.fillText("BAC: "+bac.toFixed(2),7*width/8,height/5);

		context.font="24px Impact";
		var drinkButton={
			x:7*width/8,
			y: 5*height/8,
			width: width/10,
			height: height/10,
			text: "Take a Shot"
		}

		var driveButton={
			x:7*width/8,
			y: 3*height/4,
			width: width/10,
			height: height/10,
			text: "Drive"
		}

		//Drink Button
		context.strokeStyle="#FFEB3B";
		context.lineWidth="4";
		context.strokeRect(drinkButton.x-drinkButton.width/2,drinkButton.y,drinkButton.width,drinkButton.height);
		context.fillText(drinkButton.text,drinkButton.x,drinkButton.y+drinkButton.height/2);

		//Drive Button
		context.strokeStyle="#FFEB3B";
		context.textBaseline="middle";
		context.lineWidth="4";
		context.strokeRect(driveButton.x-driveButton.width/2,driveButton.y,driveButton.width,driveButton.height);
		context.fillText(driveButton.text,driveButton.x,driveButton.y+driveButton.height/2);
		//alert("added");

		function gameClickListener(evt){
			var mousePos=getMousePos(canvas,evt);
			if(isInside(mousePos,drinkButton)){
				bac+=0.02;
				//alert("removed");
				drawMenu(false);
				if(bac===0.02){
					canvas.removeEventListener("click",gameClickListener);
					drawAlert(0.02);
				}
				else if(bac===0.06){
					canvas.removeEventListener("click",gameClickListener);
					drawAlert(0.06);
				}
				else if(bac===0.08){
					canvas.removeEventListener("click",gameClickListener);
					drawAlert(0.08);
				}
				else if(bac===0.1){
					canvas.removeEventListener("click",gameClickListener);
					drawAlert(0.1);
				}
				else if(bac===0.14){
					canvas.removeEventListener("click",gameClickListener);
					drawAlert(0.14);
				}
			}
			else if(isInside(mousePos,driveButton)){
				drive();
			}
		}

		function drawAlert(n){
			canvas.removeEventListener("click",gameClickListener);
			switch(n){
				case 0.02:
					break;
				case 0.06:
					break;
				case 0.06:
					break;
				case 0.1:
					break;
				case 0.14:
					break;
				default:
					alert("Error: Unhandled Case: "+n);
			}

			var okButton={
				x:width/2,
				y: 5*height/8,
				width: width/10,
				height: height/10,
				text: "OK"
			}

			context.fillStyle="#424242";
			context.fillRect(width/5,height/5,3*width/5,3*height/5);
			context.strokeRect(width/5,height/5,3*width/5,3*height/5);

			//OK Button
			context.strokeStyle="#FFEB3B";
			context.lineWidth="4";
			context.strokeRect(okButton.x-okButton.width/2,okButton.y,okButton.width,okButton.height);
			context.fillStyle="#FFEB3B";
			context.fillText(okButton.text,okButton.x,okButton.y+okButton.height/2);

			canvas.addEventListener("click",okClickListener,false);

			function okClickListener(evt){
				var mousePos=getMousePos(canvas,evt);
				if(isInside(mousePos,okButton)){
					canvas.removeEventListener("click",okClickListener);
					context.clearRect(0,0,width,height);
					drawMenu(true);
				}
			}
		}
	}

	function drive(){
		context.clearRect(0,0,width,height);
		var fps=60;

		var car={
			width:height/5,
			height:height/10,
			xPos:10+height/10,
			yPos:height/2+height/30+height/20,
			xVel:0,
			yVel:0,
			accel:0,
			speed:0,
			wheelDeg:0//Degree of wheel with respect to x axis.
		}

		var turningRight=false;
		var turningLeft=false;

		window.onkeydown = function(e){
			var code=e.keyCode?e.keyCode:e.which;
			switch(code){
				case 37:
					//Left
					turningLeft=true;
					break;
				case 38:
					//Up
					car.accel=0.5;
					break;
				case 39:
					//Right
					turningRight=true;
					break;
				case 40:
					//Down
					car.accel=-1;
					if(car.accel<-2){
						car.accel=-2;
					}
					break;
			}
		}

		window.onkeyup = function(e){
			var code=e.keyCode?e.keyCode:e.which;
			switch(code){
				case 37:
					//Left
					turningLeft=false;
					break;
				case 38:
					//Up
					car.accel=0;
					break;
				case 39:
					//Right
					turningRight=false;
					break;
				case 40:
					//Down
					car.accel=0;
					break;
			}
		}

		setInterval(function(){
			moveEverything();
			drawEverything();
		},1000/fps);

		function moveEverything(){
			var turnAmt=1/*Math.floor(Math.random()*10)*/;
			car.speed+=car.accel;
			car.speed-=0.1;
			if(car.speed<0){
				car.speed=0;
				car.accel=0;
			}
			if(car.speed>20){
				car.speed=20;
			}
			if(turningLeft){
				car.wheelDeg-=turnAmt;
				if(car.wheelDeg<-80){
					car.wheelDeg=-80;
				}
			}
			if(turningRight){
				car.wheelDeg+=turnAmt;
				if(car.wheelDeg>80){
					car.wheelDeg=80;
				}
			}
			//Revert
			else if(!turningLeft){
				if(car.wheelDeg>0){
					car.wheelDeg--;
				}
				else if(car.wheelDeg<0){
					car.wheelDeg++;
				}
			}
			car.xVel=car.speed*Math.cos(car.wheelDeg*Math.PI/180);
			car.yVel=car.speed*Math.sin(car.wheelDeg*Math.PI/180);
			console.log(car.xVel+","+car.yVel);
			console.log(car.wheelDeg);
			car.xPos+=car.xVel;
			car.yPos+=car.yVel;
		}

		function drawEverything(){
			context.clearRect(0,0,width,height);
			context.fillStyle="#063B00";
			context.fillRect(0,0,width,height);
			//Road
			context.fillStyle="#000000";
			context.fillRect(0,height/6,width,2*height/3);

			//Center Line
			context.strokeStyle="#FFFF00";
			context.lineWidth="5";
			context.beginPath();
			context.moveTo(0,height/2);
			context.lineTo(width,height/2);
			context.stroke();

			//Dotted Lines
			context.strokeStyle="#FFFFFF";
			var startPixel=100-(car.xPos%100);
			for(var i=-1;i<=width/100;i++){
				context.beginPath();
				context.moveTo(i*100+startPixel,height/3);
				context.lineTo((i*100)+startPixel+75,height/3);
				context.stroke();
				context.beginPath();
				context.moveTo(i*100+startPixel,2*height/3);
				context.lineTo((i*100)+startPixel+75,2*height/3);
				context.stroke();
			}

			//Car
			var carImg=new Image();
			/*car.onload = function(){
				context.drawImage(bar,0,0,3*width/4,height);
			}*/
			var num=1;
			carImg.src="images/CarRight"+num+".png";
			context.translate(10+height/10, car.yPos);
			context.rotate(car.wheelDeg*Math.PI/180);
			context.drawImage(carImg,0,(-car.height/2),car.width,car.height);
			//context.fillStyle="#FF0000";
			//context.fillRect(-car.width/2,-car.height/2,car.width,car.height);
			context.rotate(-1*car.wheelDeg*Math.PI/180);
			context.translate(-(10+height/10), -car.yPos);
		}
	}
}