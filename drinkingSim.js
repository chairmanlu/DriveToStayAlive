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
//Right cars even, left cars odd
var carImages=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];
var barBG=new Image();
var songs=[null];
var sounds=[null,null,null,null,null,null];

function onStart(){
	barBG.src="images/BarBackground.jpg";
	barBG.onload=function(){
		context.fillRect(width/4,3*height/5,width/30,height/20);
		loadImage(0);
	}
	context.fillStyle="#424242";
	context.fillRect(0,0,width,height);
	context.fillStyle="#FFEB3B";
	context.font="60px Impact";
	context.textAlign="center";
	context.textBaseline="middle";
	context.fillText("Loading...",width/2,height/2);
	context.strokeRect(width/4,3*height/5,width/2,height/20);
	function loadImage(index){
		var side="Right";
		if(index%2===1){
			side="Left";
		}
		carImages[index]=new Image();
		carImages[index].src="images/Car"+side+(Math.floor(index/2)+1)+".png";
		context.fillRect(width/4,3*height/5,(index+1)*width/30,height/20);
		if(index===carImages.length-1){
			carImages[index].onload = function(){
				loadSounds();
			}
			return;
		}
		carImages[index].onload = function(){
			loadImage(index+1);
		}
	}

	function loadSounds(){
		songs[0]=new Audio("audio/Dispersion Relation.mp3");
		songs[0].play();
		songs[0].onended=function(){
			songs[0].play();
		}
		sounds[0]=new Audio("audio/Crash.mp3");
		sounds[1]=new Audio("audio/Rev.mp3");
		sounds[2]=new Audio("audio/Honk.mp3");
		sounds[3]=new Audio("audio/Ice.mp3");
		sounds[4]=new Audio("audio/Drink.mp3");
		sounds[5]=new Audio("audio/Hiccup.mp3");
		
		songs[0].onloadeddata=function(){
			startGame();
		}
		/*loadA(0);

		function loadA(index){
			sounds[index].load();
			if(index===sounds.length-1){
				sounds[index].onloadeddata=function(){
					startGame();
					return;
				}
			}
			else{
				sounds[index].onloadeddata=function(){
					console.log(index);
					loadA(index+1);
				}
			}
		}*/
		//startGame();
	}
}

function startGame(){
	context.fillStyle="#424242";
	context.fillRect(0,0,width,height);
	context.drawImage(barBG,0,0,3*width/4,height);
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
			canvas.removeEventListener("click",menuClickListener);
			playGame();
			
		}
		else if(isInside(mousePos,helpButton)){
			canvas.removeEventListener("click",menuClickListener);
			help();

		}
		else if(isInside(mousePos,creditsButton)){
			canvas.removeEventListener("click",menuClickListener);
			credits();
		}
	}
}

function help(){
	var menuButton={
		x:width/2,
		y: 3*height/4,
		width: width/10,
		height: height/10,
		text: "Menu"
	}

	context.clearRect(0,0,width,height);
	context.fillStyle="#424242";
	context.fillRect(0,0,width,height);
	//Menu Button
	context.strokeStyle="#FFEB3B";
	context.fillStyle="#FFEB3B";
	context.textBaseline="middle";
	context.textAlign="center";
	context.font="60px Impact";
	context.fillText("Instructions",width/2,height/10);
	context.font="32px Impact";
	context.fillText("Use the up arrow to accelerate and down arrow to brake.",width/2,3*height/10);
	context.fillText("Use the left and right arrows to turn.",width/2,4*height/10);
	context.fillText("Avoid the other cars. If you go too slowly, you will get rear ended.", width/2, 5*height/10);
	context.fillText("Click the 'Take a Shot' button to increase your BAC.", width/2, 6*height/10);
	context.fillText("There will be different effects from different BAC levels.", width/2, 7*height/10);
	context.lineWidth="4";
	context.strokeRect(menuButton.x-menuButton.width/2,menuButton.y,menuButton.width,menuButton.height);
	context.fillText(menuButton.text,menuButton.x,menuButton.y+menuButton.height/2);
	canvas.addEventListener("click",menuButtonListener,false);

	function menuButtonListener(evt){
		var mousePos=getMousePos(canvas,evt);
		if(isInside(mousePos, menuButton)){
			startGame();
			canvas.removeEventListener("click",menuButtonListener);
		}
	}
}

function credits(evt){
	var menuButton={
		x:width/2,
		y: 3*height/4,
		width: width/10,
		height: height/10,
		text: "Menu"
	}

	context.clearRect(0,0,width,height);
	//Menu Button
	context.fillStyle="#424242";
	context.fillRect(0,0,width,height);
	context.strokeStyle="#FFEB3B";
	context.fillStyle="#FFEB3B";
	context.textBaseline="middle";
	context.textAlign="center";
	context.font="60px Impact";
	context.fillText("Credits",width/2,height/10);
	context.font="24px Impact";
	context.fillText("Programming: Steven Lu",width/4,4*height/20);
	context.fillText("Images: Pixabay, Wikimedia Commons",width/4,5*height/20);
	context.fillText("Special Thanks: Stackoverflow, Sunjae Lee",width/4,6*height/20);
	context.fillText("Music:",width/4,8*height/20);
	context.fillText("\"Dispersion Relation\" Kevin MacLeod (incompetech.com)",width/4,9*height/20);
	context.fillText("Licensed under Creative Commons: By Attribution 3.0 License",width/4,10*height/20);
	context.fillText("http://creativecommons.org/licenses/by/3.0/",width/4,11*height/20);

	context.fillText("Sound Effects",3*width/4,4*height/20);
	context.fillText("Crash-Cam Martinez http://soundbible.com/1757-Car-Brake-Crash.html",3*width/4,6*height/20);
	context.fillText("Rev-Mike Koenig http://soundbible.com/804-Engine-Rev-Inside-Car.html",3*width/4,7*height/20);
	context.fillText("Honk-Mike Koenig http://soundbible.com/1048-Horn-Honk.html",3*width/4,8*height/20);
	context.fillText("Drink-fille1000 http://soundbible.com/1502-Slurping-2.html",3*width/4,9*height/20);
	context.fillText("Ice-Daniel Simion http://soundbible.com/2182-Ice-Cubes-Glass.html",3*width/4,10*height/20);
	context.fillText("Hiccup-Mike Koenig http://soundbible.com/861-Hiccup.html",3*width/4,11*height/20);
	context.lineWidth="4";
	context.strokeRect(menuButton.x-menuButton.width/2,menuButton.y,menuButton.width,menuButton.height);
	context.fillText(menuButton.text,menuButton.x,menuButton.y+menuButton.height/2);
	canvas.addEventListener("click",menuButtonListener,false);

	function menuButtonListener(evt){
		var mousePos=getMousePos(canvas,evt);
		if(isInside(mousePos, menuButton)){
			startGame();
			canvas.removeEventListener("click",menuButtonListener);
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
	return;
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
			//alert("added");
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
				sounds[3].play();
				setTimeout(function(){
					sounds[4].play();
					setTimeout(function(){
						sounds[5].play();
						sounds[3].load();
						sounds[4].load();
						sounds[5].load();
					},1500);
				},1500);
				//alert("removed");
				drawMenu(false);
				if(bac===0.04){
					canvas.removeEventListener("click",gameClickListener);
					drawAlert(0.04);
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
				return;
			}
			else if(isInside(mousePos,driveButton)){
				canvas.removeEventListener("click",gameClickListener);
				//alert("drive");
				drive();
				return;
			}
		}

		function drawAlert(n){
			canvas.removeEventListener("click",gameClickListener);

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

			context.strokeStyle="#FFEB3B";
			context.font="48px Impact";
			context.textAlign="center";
			context.textBaseline="middle";
			context.fillText("BAC "+n,width/2,3*height/10);
			context.font="28px Impact";
			switch(n){
				case 0.04:
					context.fillText("Real Life Effects: Reduced Coordination, Difficulty Steering", width/2, 2*height/5);
					context.fillText("In Game Effects: Steering becomes Erratic and Unpredicable", width/2, height/2);
					break;
				case 0.08:
					context.fillText("Real Life Effects: Illegal to Drive in All States, Less Speed Control, Impaired Perception", width/2, 2*height/5);
					context.fillText("In Game Effects: Less Speed Control", width/2, height/2);
					break;
				case 0.1:
					context.fillText("Real Life Effects: Inability To Maintain Lane Position and Brake, Slower Reaction Time", width/2, 2*height/5);
					context.fillText("In Game Effects: Turning and Braking Will Be Delayed", width/2, height/2);
					break;
				case 0.14:
					context.fillText("Substantial Impairment to Visual and Audio Processing", width/2, 2*height/5);
					context.fillText("Range of Vision Reduced", width/2, height/2);
					break;
				default:
					alert("Error: Unhandled Case: "+n);
			}

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
		//alert("drive called");
		context.clearRect(0,0,width,height);
		var fps=60;

		var deathCount=0;

		var car={
			width:height/5,
			height:height/10,
			xPos:(10+height/10),
			yPos:height/2+height/30+height/20,
			xVel:0,
			yVel:0,
			accel:0,
			speed:0,
			wheelDeg:0//Degree of wheel with respect to x axis.
		}

		var turningRight=false;
		var turningLeft=false;

		var maxSpeed=30;
		if(bac>=0.08){
			maxSpeed=60;
		}
		var mph=0;
		var distTraveled=0;
		//Other Cars
		//1 Is for bottom/right cars, 2 for top/left cars
		//Number is distance from player, odd indices are right lane, even indices are left lane
		var rightCars=[{d:0,lane:0,car:0},{d:0,lane:0,car:0},{d:0,lane:0,car:0},{d:0,lane:0,car:0},{d:0,lane:0,car:0},{d:0,lane:0,car:0},{d:0,lane:0,car:0}];
		var leftCars=[{d:0,lane:0,car:0},{d:0,lane:0,car:0},{d:0,lane:0,car:0},{d:0,lane:0,car:0},{d:0,lane:0,car:0},{d:0,lane:0,car:0},{d:0,lane:0,car:0}];
		var minDistR=width/2;
		var minDistL=width/2;

		for(var i=0;i<7;i++){
			rightCars[i].d=minDistR+Math.ceil(Math.random()*width/3);
			leftCars[i].d=minDistL+Math.ceil(Math.random()*width/3);
			rightCars[i].lane=Math.floor(Math.random()*2);
			leftCars[i].lane=Math.floor(Math.random()*2);
			rightCars[i].color=Math.ceil(Math.random()*7);
			leftCars[i].color=Math.ceil(Math.random()*7);
			minDistR=rightCars[i].d+width/3;
			minDistL=leftCars[i].d+width/3;
		}

		var otherCarSpeed=maxSpeed/2;
		if(bac>=0.08){
			otherCarSpeed=maxSpeed/4;
		}

		window.onkeydown = function(e){
			var code=e.keyCode?e.keyCode:e.which;
			switch(code){
				case 37:
					//Left
					if(bac>=0.1){
						setTimeout(function(){turningLeft=true;},bac*5*1000);
					}
					else{
						turningLeft=true;
					}
					break;
				case 38:
					//Up
					car.accel=0.5;
					if(bac>=0.04){
						car.accel+=Math.random()+0.1;
					}
					if(!crashed){
						sounds[1].play();
					}
					break;
				case 39:
					//Right
					if(bac>=0.1){
						setTimeout(function(){turningRight=true;},bac*5*1000);
					}
					else{
						turningRight=true;
					}
					break;
				case 40:
					//Down
					car.accel=-0.8;
					break;
			}
		}

		window.onkeyup = function(e){
			var code=e.keyCode?e.keyCode:e.which;
			switch(code){
				case 37:
					//Left
					if(bac>=0.1){
						setTimeout(function(){turningLeft=false;},bac*5*1000);
					}
					else{
						turningLeft=false;
					}
					break;
				case 38:
					//Up
					car.accel=0;
					break;
				case 39:
					//Right
					if(bac>=0.1){
						setTimeout(function(){turningRight=false;},bac*5*1000);
					}
					else{
						turningRight=false;
					}
					break;
				case 40:
					//Down
					car.accel=0;
					break;
			}
		}
		var interval;
		var crashed=false;
		interval=setInterval(function(){
			moveEverything();
			drawEverything(false);
			//moveEverything();
		},1000/fps);


		function moveEverything(){
			var turnAmt=1/*Math.floor(Math.random()*10)*/;
			if(crashed){
				return;
			}
			if(bac>=0.04){//BAC 0.04 Erratic Turning
				turnAmt=Math.ceil(Math.random()*bac*100);
			}
			car.speed+=car.accel;
			car.speed-=0.1;
			if(car.speed<0){
				car.speed=0;
				car.accel=0;
			}
			if(car.speed<otherCarSpeed){
				deathCount++;
				if(deathCount==3*fps){
					sounds[2].play();
					setTimeout(function(){
						sounds[2].load();
					},500);
				}
			}
			else if(deathCount>0){
				deathCount--;
			}
			if(car.speed>maxSpeed){
				car.speed=maxSpeed;
			}
			if(turningLeft&&car.speed>0){
				car.wheelDeg-=turnAmt;
				if(car.wheelDeg<-80){
					car.wheelDeg=-80;
				}
			}
			if(turningRight&&car.speed>0){
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
			//console.log(car.xVel+","+car.yVel);
			//console.log(car.wheelDeg);
			car.xPos+=car.xVel;
			car.yPos+=car.yVel;
			/*console.log(minDist+";"+width);
			console.log(rightCars);*/
			minDistR-=car.xVel-otherCarSpeed;
			minDistL-=car.xVel+otherCarSpeed;
			for(var i=0;i<7;i++){
				rightCars[i].d-=(car.xVel-otherCarSpeed);
				leftCars[i].d-=(car.xVel+otherCarSpeed);
				if(rightCars[i].d<-width/5){
					rightCars[i].d=minDistR+Math.ceil(Math.random()*width/3);
					minDistR=rightCars[i].d+width/3;
					rightCars[i].lane=Math.floor(Math.random()*2);
					rightCars[i].color=Math.ceil(Math.random()*7);
					/*console.log(minDist+";"+width);
					console.log(rightCars);*/
				}
				if(leftCars[i].d<-width/5){
					leftCars[i].d=minDistL+Math.ceil(Math.random()*width/3);
					leftCars[i].lane=Math.floor(Math.random()*2);
					leftCars[i].color=Math.ceil(Math.random()*7);
					minDistL=leftCars[i].d+width/3;
					/*console.log(minDist+";"+width);
					console.log(leftCars);*/
				}
				if(rightCars[i].d>minDistR*2){
					rightCars[i].d=minDistR+Math.ceil(Math.random()*width/3);
					rightCars[i].lane=Math.floor(Math.random()*2);
					rightCars[i].color=Math.ceil(Math.random()*7);
					minDistR=rightCars[i].d+width/3;
				}

				//Check Collisions
				rect2={
					left:rightCars[i].d+car.width/16,
					right:rightCars[i].d+car.width-car.width/16,
					top:height/2+height/30+height/20-car.height/2+(rightCars[i].lane%2*height/6)+car.height/16,
					bottom:height/2+height/30+height/20-car.height/2+(rightCars[i].lane%2*height/6)+car.height-car.height/16
				}
				rect3={
					left:leftCars[i].d+car.width/16,
					right:leftCars[i].d+car.width-car.width/16,
					top:height/2-height/30-height/20-height/6-car.height/2+(leftCars[i].lane%2*height/6)+car.height/16,
					bottom:height/2-height/30-height/20-height/6-car.height/2+(leftCars[i].lane%2*height/6)+car.height-car.height/16
				}
				//Rectangle formula by Sunjae Lee.
				var p1={
					x:(10+height/10)+(7*car.width/8)/2*Math.cos(car.wheelDeg*Math.PI/180)-(4*car.height/5)/2*Math.sin(car.wheelDeg*Math.PI/180),
					y:car.yPos+(7*car.width/8)/2*Math.sin(car.wheelDeg*Math.PI/180)+(4*car.height/5)/2*Math.cos(car.wheelDeg*Math.PI/180)
				}
				var p4={
					x:(10+height/10)+(7*car.width/8)/2*Math.cos(car.wheelDeg*Math.PI/180)+(4*car.height/5)/2*Math.sin(car.wheelDeg*Math.PI/180),
					y:car.yPos+(7*car.width/8)/2*Math.sin(car.wheelDeg*Math.PI/180)-(4*car.height/5)/2*Math.cos(car.wheelDeg*Math.PI/180)
				}
				var p2={
					x:(10+height/10)-(7*car.width/8)/2*Math.cos(car.wheelDeg*Math.PI/180)-(4*car.height/5)/2*Math.sin(car.wheelDeg*Math.PI/180),
					y:car.yPos-(7*car.width/8)/2*Math.sin(car.wheelDeg*Math.PI/180)+(4*car.height/5)/2*Math.cos(car.wheelDeg*Math.PI/180)
				}
				var p3={
					x:(10+height/10)-(7*car.width/8)/2*Math.cos(car.wheelDeg*Math.PI/180)+(4*car.height/5)/2*Math.sin(car.wheelDeg*Math.PI/180),
					y:car.yPos-(4*car.width/5)/2*Math.sin(car.wheelDeg*Math.PI/180)-(4*car.height/5)/2*Math.cos(car.wheelDeg*Math.PI/180)
				}

				var pol1=[p1,p2,p3,p4];
				//console.log("("+p1.x+","+p1.y+")"+","+"("+p2.x+","+p2.y+")"+","+"("+p3.x+","+p3.y+")"+","+"("+p4.x+","+p4.y+")");
				var pol2=[{x:rect2.left,y:rect2.top},{x:rect2.right,y:rect2.top},{x:rect2.right,y:rect2.bottom},{x:rect2.left,y:rect2.bottom}];
				var pol3=[{x:rect3.left,y:rect3.top},{x:rect3.right,y:rect3.top},{x:rect3.right,y:rect3.bottom},{x:rect3.left,y:rect3.bottom}];
				//console.log(pol2[0].x+","+pol2[0].y);
				
				//Game Over Check
				if(isIntersecting(pol1,pol2)){
					gameOver(false);
					return;
				}

				if(isIntersecting(pol1,pol3)){
					//console.log(pol1+","+pol3);
					gameOver(false);
					return;
				}

				if(car.yPos-(car.height/2)<1*height/8){
					gameOver(false);
					return;
				}
				if(car.yPos+(car.height/2)>7*height/8){
					//alert("Crash");
					console.log(car.xPos+","+car.yPos);
					gameOver(false);
					return;
				}

				if(deathCount>fps*5){
					gameOver(true);
					return;
				}
			}

			/**
			 * Helper function to determine whether there is an intersection between the two polygons described
			 * by the lists of vertices. Uses the Separating Axis Theorem
			 *
			 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
			 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
			 * @return true if there is any intersection between the 2 polygons, false 
			 *
			 * Function from Stackoverflow user Markus Jarderot/mstenroos https://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles
			 */
			function isIntersecting (a, b) {
				var polygons = [a, b];
				var minA, maxA, projected, i, i1, j, minB, maxB;

				for (i = 0; i < polygons.length; i++) {

					// for each polygon, look at each edge of the polygon, and determine if it separates
					// the two shapes
					var polygon = polygons[i];
					for (i1 = 0; i1 < polygon.length; i1++) {

						// grab 2 vertices to create an edge
						var i2 = (i1 + 1) % polygon.length;
						var p1 = polygon[i1];
						var p2 = polygon[i2];

						// find the line perpendicular to this edge
						var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

						minA = maxA = undefined;
						// for each vertex in the first shape, project it onto the line perpendicular to the edge
						// and keep track of the min and max of these values
						for (j = 0; j < a.length; j++) {
							projected = normal.x * a[j].x + normal.y * a[j].y;
							if (isUndefined(minA) || projected < minA) {
								minA = projected;
							}
							if (isUndefined(maxA) || projected > maxA) {
								maxA = projected;
							}
						}

						// for each vertex in the second shape, project it onto the line perpendicular to the edge
						// and keep track of the min and max of these values
						minB = maxB = undefined;
						for (j = 0; j < b.length; j++) {
							projected = normal.x * b[j].x + normal.y * b[j].y;
							if (isUndefined(minB) || projected < minB) {
								minB = projected;
							}
							if (isUndefined(maxB) || projected > maxB) {
								maxB = projected;
							}
						}

						// if there is no overlap between the projects, the edge we are looking at separates the two
						// polygons, and we know there is no overlap
						if (maxA < minB || maxB < minA) {
							return false;
						}
					}
				}
				return true;

				function isUndefined(v){
					return v==undefined;
				}
			}

			function gameOver(rearEnded){
				crashed=true;
				sounds[0].play();
				clearInterval(interval);

				drawEverything(true);

				var retryButton={
					x:2*width/5,
					y: 5*height/8,
					width: width/10,
					height: height/10,
					text: "Retry"
				}

				var menuButton={
					x:3*width/5,
					y: 5*height/8,
					width: width/10,
					height: height/10,
					text: "Main Menu"
				}
				//console.log("filled");
				context.fillStyle="#424242";
				context.fillRect(width/5,height/5,3*width/5,3*height/5);
				//context.strokeRect(width/5,height/5,3*width/5,3*height/5);
				//OK Button
				context.font="32px Impact";
				context.strokeStyle="#FFEB3B";
				context.lineWidth="4";
				context.strokeRect(retryButton.x-retryButton.width/2,retryButton.y,retryButton.width,retryButton.height);
				context.fillStyle="#FFEB3B";
				context.fillText(retryButton.text,retryButton.x,retryButton.y+retryButton.height/2);

				context.font="32px Impact";
				context.strokeStyle="#FFEB3B";
				context.lineWidth="4";
				context.strokeRect(menuButton.x-menuButton.width/2,menuButton.y,menuButton.width,menuButton.height);
				context.fillStyle="#FFEB3B";
				context.fillText(menuButton.text,menuButton.x,menuButton.y+menuButton.height/2);

				//Text
				context.fillStyle="#FFEB3B";
				context.font="60px Impact";
				context.textBaseline="middle";
				context.textAlign="center";
				context.fillText("Game Over",width/2,height/4);
				context.font="24px Impact";
				if(rearEnded){
					context.fillText("You drove too slowly and got rear ended.",width/2,7*height/20)
				}
				else{
					context.fillText("You crashed!",width/2,7*height/20)
				}
				context.fillText("You made it "+distTraveled.toFixed(2)+" miles. Click the 'Retry' Button to restart.",width/2,2*height/5);
				
				if(bac>=0.04){
					context.fillText("But remember: There are no restarts in life. Never Drink and Drive.",width/2,height/2);
				}
				canvas.addEventListener("click",retryClickListener,false);

				function retryClickListener(evt){
					var mousePos=getMousePos(canvas,evt);
					if(isInside(mousePos,retryButton)){
						canvas.removeEventListener("click",retryClickListener);
						context.clearRect(0,0,width,height);
						bac=0;
						drawMenu(true);
						//alert("Clicked");
						return;
					}
					if(isInside(mousePos,menuButton)){
						canvas.removeEventListener("click",retryClickListener);
						context.clearRect(0,0,width,height);
						bac=0;
						startGame();
						//alert("Clicked");
						return;
					}

				}
			}
		}

		function drawEverything(ignore){
			//console.log("drawn");
			if(crashed&&!ignore){
				return;
			}
			context.clearRect(0,0,width,height);
			context.fillStyle="#063B00";
			context.fillRect(0,0,width,height);
			//Road
			context.fillStyle="#000000";
			context.fillRect(0,height/6,width,2*height/3);
			
			//Shoulder Barriers
			context.strokeStyle="#424242";
			context.lineWidth="5";
			context.beginPath();
			context.moveTo(0,height/8);
			context.lineTo(width,height/8);
			context.stroke();

			context.beginPath();
			context.moveTo(0,7*height/8);
			context.lineTo(width,7*height/8);
			context.stroke();
			//Center Line
			context.strokeStyle="#FFFF00";
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
			
			// carImg.src="images/BarBackground.jpg";
			context.translate(10+height/10, car.yPos);
			context.rotate(car.wheelDeg*Math.PI/180);
			context.drawImage(carImages[0],-height/10,(-car.height/2),car.width,car.height);
			//context.fillStyle="#FF0000";
			//context.fillRect(-car.width/2,-car.height/2,car.width,car.height);
			context.rotate(-1*car.wheelDeg*Math.PI/180);
			context.translate(-(10+height/10), -car.yPos);
			//console.log(car.xPos);
			//Other Cars
			for(var i=0;i<7;i++){
				//var num1=Math.ceil(Math.random()*7);
				//var num2=Math.ceil(Math.random()*7);
				/*car1Img.src="images/BarBackground.jpg";
				car2Img.src="images/BarBackground.jpg";*/
				var carImg1=carImages[(rightCars[i].color-1)*2];
				var carImg2=carImages[(leftCars[i].color-1)*2+1];
				context.drawImage(carImg1,rightCars[i].d,height/2+height/30+height/20-car.height/2+(rightCars[i].lane%2*height/6),car.width,car.height);
				context.drawImage(carImg2,leftCars[i].d,height/2-height/30-height/6-height/20-car.height/2+(leftCars[i].lane%2*height/6),car.width,car.height);
			}



			//BAC 0.15
			if(bac>=0.14){
				var grad=context.createRadialGradient((10+height/10),car.yPos,10,(10+height/10),car.yPos,width/(bac*10));
				grad.addColorStop(0,"transparent");
				grad.addColorStop(1,"#000000");
				context.fillStyle=grad;
				context.fillRect(0,0,width,height);
			}

			//Dashboard
			context.strokeStyle="#000000";
			context.fillStyle="#000000";
			context.lineWidth="4";
			context.clearRect(0,11*height/12,width/2,height/12);
			context.strokeRect(0,11*height/12,width/2,height/12);
			context.textBaseline="middle";
			context.textAlign="center";
			context.font="20px Impact";
			mph=Math.floor(((car.speed*fps/500)*3600*200)/(12*5280));
			distTraveled=(200*car.xPos/(500*12*5280));
			context.fillText("Speed: "+mph+"mph",width/8,23*height/24);
			context.fillText("Distance Traveled: "+distTraveled.toFixed(2)+"miles",3*width/8,23*height/24);
			//Hitbox Debug
			/*for(var i=0;i<7;i++){
				rect2={
					left:rightCars[i].d+car.width/16,
					right:rightCars[i].d+car.width-car.width/16,
					top:height/2+height/30+height/20-car.height/2+(rightCars[i].lane%2*height/6)+car.height/16,
					bottom:height/2+height/30+height/20-car.height/2+(rightCars[i].lane%2*height/6)+car.height-car.height/16
				}
				rect3={
					left:leftCars[i].d+car.width/16,
					right:leftCars[i].d+car.width-car.width/16,
					top:height/2-height/30-height/20-height/6-car.height/2+(leftCars[i].lane%2*height/6)+car.height/16,
					bottom:height/2-height/30-height/20-height/6-car.height/2+(leftCars[i].lane%2*height/6)+car.height-car.height/16
				}
				//Rectangle formula by Sunjae Lee.
				var p1={
					x:(10+height/10)+(7*car.width/8)/2*Math.cos(car.wheelDeg*Math.PI/180)-(4*car.height/5)/2*Math.sin(car.wheelDeg*Math.PI/180),
					y:car.yPos+(7*car.width/8)/2*Math.sin(car.wheelDeg*Math.PI/180)+(4*car.height/5)/2*Math.cos(car.wheelDeg*Math.PI/180)
				}
				var p4={
					x:(10+height/10)+(7*car.width/8)/2*Math.cos(car.wheelDeg*Math.PI/180)+(4*car.height/5)/2*Math.sin(car.wheelDeg*Math.PI/180),
					y:car.yPos+(7*car.width/8)/2*Math.sin(car.wheelDeg*Math.PI/180)-(4*car.height/5)/2*Math.cos(car.wheelDeg*Math.PI/180)
				}
				var p2={
					x:(10+height/10)-(7*car.width/8)/2*Math.cos(car.wheelDeg*Math.PI/180)-(4*car.height/5)/2*Math.sin(car.wheelDeg*Math.PI/180),
					y:car.yPos-(7*car.width/8)/2*Math.sin(car.wheelDeg*Math.PI/180)+(4*car.height/5)/2*Math.cos(car.wheelDeg*Math.PI/180)
				}
				var p3={
					x:(10+height/10)-(7*car.width/8)/2*Math.cos(car.wheelDeg*Math.PI/180)+(4*car.height/5)/2*Math.sin(car.wheelDeg*Math.PI/180),
					y:car.yPos-(4*car.width/5)/2*Math.sin(car.wheelDeg*Math.PI/180)-(4*car.height/5)/2*Math.cos(car.wheelDeg*Math.PI/180)
				}

				var pol1=[p1,p2,p3,p4];
				//console.log("("+p1.x+","+p1.y+")"+","+"("+p2.x+","+p2.y+")"+","+"("+p3.x+","+p3.y+")"+","+"("+p4.x+","+p4.y+")");
				var pol2=[{x:rect2.left,y:rect2.top},{x:rect2.right,y:rect2.top},{x:rect2.right,y:rect2.bottom},{x:rect2.left,y:rect2.bottom}];
				var pol3=[{x:rect3.left,y:rect3.top},{x:rect3.right,y:rect3.top},{x:rect3.right,y:rect3.bottom},{x:rect3.left,y:rect3.bottom}];
				//console.log(pol2[0].x+","+pol2[0].y);
				//Hitbox Debug
				context.strokeStyle="#FFFF00";
				context.lineWidth="4";
				context.beginPath();
				context.moveTo(p1.x,p1.y);
				context.lineTo(p2.x,p2.y);
				context.stroke();
				context.beginPath();
				context.moveTo(p2.x,p2.y);
				context.lineTo(p3.x,p3.y);
				context.stroke();
				context.beginPath();
				context.moveTo(p3.x,p3.y);
				context.lineTo(p4.x,p4.y);
				context.stroke();
				context.beginPath();
				context.moveTo(p4.x,p4.y);
				context.lineTo(p1.x,p1.y);
				context.stroke();

				context.strokeStyle="#FF0000";
				context.beginPath();
				context.moveTo(pol2[0].x,pol2[0].y);
				context.lineTo(pol2[1].x,pol2[1].y);
				context.stroke();
				context.beginPath();
				context.moveTo(pol2[0].x,pol2[0].y);
				context.lineTo(pol2[3].x,pol2[3].y);
				context.stroke();
				context.beginPath();
				context.moveTo(pol2[2].x,pol2[2].y);
				context.lineTo(pol2[1].x,pol2[1].y);
				context.stroke();
				context.beginPath();
				context.moveTo(pol2[3].x,pol2[3].y);
				context.lineTo(pol2[2].x,pol2[2].y);
				context.stroke();

				context.beginPath();
				context.moveTo(pol3[0].x,pol3[0].y);
				context.lineTo(pol3[1].x,pol3[1].y);
				context.stroke();
				context.beginPath();
				context.moveTo(pol3[0].x,pol3[0].y);
				context.lineTo(pol3[3].x,pol3[3].y);
				context.stroke();
				context.beginPath();
				context.moveTo(pol3[2].x,pol3[2].y);
				context.lineTo(pol3[1].x,pol3[1].y);
				context.stroke();
				context.beginPath();
				context.moveTo(pol3[3].x,pol3[3].y);
				context.lineTo(pol3[2].x,pol3[2].y);
				context.stroke();
			}*/




		}
	}
}