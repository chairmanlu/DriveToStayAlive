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

var carImages=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];

function onStart(){
	var loaded1=false;
	var loaded2=false;
	loadImage(0);
	loadImage(0);
	context.fillStyle="424242";
	context.font="60px Impact";
	context.textAlign="center";
	context.textBaseline="middle";
	context.fillText("Loading...",width/2,height/2);
	function loadImage(index){
		var side="Right";
		if(index%2===1){
			side="Left";
		}
		carImages[index]=new Image();
		console.log(index+" "+carImages.length);
		carImages[index].src="images/Car"+side+(Math.floor(index/2)+1)+".png";
		if(index===carImages.length-1){
			carImages[index].onload = function(){
				startGame();
			}
			return;
		}
		carImages[index].onload = function(){
			loadImage(index+1);
		}
	}
}


function startGame(){
	context.fillStyle="#215EF7";
	context.fillRect(0,0,width,height);
	var textBG=new Image();
	textBG.onload = function(){
		context.drawImage(textBG,0,0,3*width/4,height);
	}
	textBG.src="images/TextingBackground.jpg";
	context.fillStyle="#FFFFFF";
	context.font="32px Arial";
	context.textAlign="center";
	context.fillText("Texting and Driving\nSimulator",7*width/8,height/8);

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
	context.strokeStyle="#FFFFFF";
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
	drive();
	function drive(){
		//alert("drive called");
		context.clearRect(0,0,width,height);
		var fps=60;

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
			rightCars[i].color=Math.ceil(Math.random()*7);
			leftCars[i].lane=Math.floor(Math.random()*2);
			leftCars[i].color=Math.ceil(Math.random()*7);
			minDistR=rightCars[i].d+width/3;
			minDistL=leftCars[i].d+width/3;
		}

		var otherCarSpeed=maxSpeed/2;

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
					car.accel=-0.8;
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


		//Phone Stuff
		var num1=Math.floor(Math.random()*13);
		var num2=Math.floor(Math.random()*13);
		var operation=Math.floor(Math.random()*3);
		var operations=['+','-','*'];
		var userNum="";
		var totalQuestions=0;
		var correct=0;
		var answer=num1+num2;
		if(operation===1){
			answer=num1-num2;
		}
		if(operation===2){
			answer=num1*num2;
		}

		var numPad=[{x:0,y:0,height:0,width:0,text:""},{x:0,y:0,height:0,width:0,text:""},{x:0,y:0,height:0,width:0,text:""},
					{x:0,y:0,height:0,width:0,text:""},{x:0,y:0,height:0,width:0,text:""},{x:0,y:0,height:0,width:0,text:""},
					{x:0,y:0,height:0,width:0,text:""},{x:0,y:0,height:0,width:0,text:""},{x:0,y:0,height:0,width:0,text:""},
					{x:0,y:0,height:0,width:0,text:""},{x:0,y:0,height:0,width:0,text:""},{x:0,y:0,height:0,width:0,text:""}];

		//Initialize NumPad
		for(var i=0;i<12;i++){
			var row=Math.floor(i/3);
			var col=i%3;
			//console.log(row+","+col);
			numPad[i].x=width/2+(width/2-height/2)/2+height/10+col*height/10+height/20;
			numPad[i].y=height/4+row*height/8;
			numPad[i].width=height/10;
			numPad[i].height=height/8;
			numPad[i].text=i+1;
			if(i===9){
				numPad[i].text="-";
			}
			if(i===10){
				numPad[i].text=0;
			}
			if(i===11){
				numPad[i].text="Enter";
			}
		}

		canvas.addEventListener("click",numPadListener,false);

		function numPadListener(evt){
			var mousePos=getMousePos(canvas,evt);
			for(var i=0;i<12;i++){
				if(isInside(mousePos,numPad[i])){
					//alert(numPad[i].x+","+numPad[i].width+"|"+mousePos.x);
					if(numPad[i].text==="Enter"){
						if(parseInt(userNum)===answer){
							//alert(correct);
							correct++;
						}
						userNum="";
						totalQuestions++;
						num1=Math.floor(Math.random()*13);
						num2=Math.floor(Math.random()*13);
						operation=Math.floor(Math.random()*3);
						answer=num1+num2;
						if(operation===1){
							answer=num1-num2;
						}
						if(operation===2){
							answer=num1*num2;
						}
					}
					else if(userNum.length<10){
						userNum+=numPad[i].text;
					}
				}
			}

		}

		


		var deathCount=0;

		var interval;
		var crashed=false;
		interval=setInterval(function(){
			moveEverything();
			drawEverything(false);
			//moveEverything();
		},1000/fps);

		function moveEverything(){
			var turnAmt=1/*Math.floor(Math.random()*10)*/;
			car.speed+=car.accel;
			car.speed-=0.1;
			if(car.speed<0){
				car.speed=0;
				car.accel=0;
			}
			if(car.speed<maxSpeed/2){
				deathCount++;
			}
			else{
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
					minDistL=leftCars[i].d+width/3;
					leftCars[i].lane=Math.floor(Math.random()*2);
					leftCars[i].color=Math.ceil(Math.random()*7);
					/*console.log(minDist+";"+width);
					console.log(leftCars);*/
				}
				if(rightCars[i].d>minDistR*2){
					rightCars[i].d=minDistR+Math.ceil(Math.random()*width/3);
					minDistR=rightCars[i].d+width/3;
					rightCars[i].lane=Math.floor(Math.random()*2);
					rightCars[i].color=Math.ceil(Math.random()*7);
				}

				//Check Collisions
				rect2={
					left:rightCars[i].d+car.width/16,
					right:rightCars[i].d+car.width-car.width/16,
					top:height/2+height/30+height/20-car.height/2+(rightCars[i].lane*height/6)+car.height/16,
					bottom:height/2+height/30+height/20-car.height/2+(rightCars[i].lane*height/6)+car.height-car.height/16
				}
				rect3={
					left:leftCars[i].d+car.width/16,
					right:leftCars[i].d+car.width-car.width/16,
					top:height/2-height/30-height/20-height/6-car.height/2+(leftCars[i].lane*height/6)+car.height/16,
					bottom:height/2-height/30-height/20-height/6-car.height/2+(leftCars[i].lane*height/6)+car.height-car.height/16
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
					y:car.yPos-(7*car.width/8)/2*Math.sin(car.wheelDeg*Math.PI/180)-(4*car.height/5)/2*Math.cos(car.wheelDeg*Math.PI/180)
				}

				var pol1=[p1,p2,p3,p4];
				//console.log("("+p1.x+","+p1.y+")"+","+"("+p2.x+","+p2.y+")"+","+"("+p3.x+","+p3.y+")"+","+"("+p4.x+","+p4.y+")");
				var pol2=[{x:rect2.left,y:rect2.top},{x:rect2.right,y:rect2.top},{x:rect2.right,y:rect2.bottom},{x:rect2.left,y:rect2.bottom}];
				var pol3=[{x:rect3.left,y:rect3.top},{x:rect3.right,y:rect3.top},{x:rect3.right,y:rect3.bottom},{x:rect3.left,y:rect3.bottom}];
				//console.log(pol2[0].x+","+pol2[0].y);
				//Hitbox Debug
				/*context.strokeStyle="#FFFF00";
				context.lineWidth="4";
				context.beginPath();
				context.moveTo(p1.x,p1.y);
				context.lineTo(p2.x,p2.y);
				context.stroke();
				context.beginPath();
				context.moveTo(p2.x,p2.y);
				context.lineTo(p4.x,p4.y);
				context.stroke();
				context.beginPath();
				context.moveTo(p3.x,p3.y);
				context.lineTo(p4.x,p4.y);
				context.stroke();
				context.beginPath();
				context.moveTo(p3.x,p3.y);
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
				context.stroke();*/

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
				clearInterval(interval);

				drawEverything(true);
				canvas.removeEventListener("click",numPadListener);
				var retryButton={
					x:width/2,
					y: 5*height/8,
					width: width/10,
					height: height/10,
					text: "Retry"
				}
				context.textAlign="center";
				//console.log("filled");
				context.fillStyle="#215EF7";
				context.fillRect(width/5,height/5,3*width/5,3*height/5);
				//context.strokeRect(width/5,height/5,3*width/5,3*height/5);
				//OK Button
				context.strokeStyle="#FFFFFF";
				context.lineWidth="4";
				context.strokeRect(retryButton.x-retryButton.width/2,retryButton.y,retryButton.width,retryButton.height);
				context.fillStyle="#FFFFFF";
				context.fillText(retryButton.text,retryButton.x,retryButton.y+retryButton.height/2);

				//Text
				context.fillStyle="#FFFFFF";
				context.font="60px Arial";
				context.textBaseline="middle";
				context.textAlign="center";
				context.fillText("Game Over",width/2,height/4);
				context.font="24px Arial";
				if(rearEnded){
					context.fillText("You drove too slowly and got rear ended.",width/2,7*height/20)
				}
				else{
					context.fillText("You crashed!",width/2,7*height/20)
				}
				context.fillText("You made it "+distTraveled.toFixed(2)+" miles. Click the 'Retry' Button to restart.",width/2,9*height/20);
				context.fillText("Questions Answered: "+correct+"/"+totalQuestions,width/2,2*height/5);
				context.fillText("But remember: There are no restarts in life. Never Text and Drive.",width/2,height/2);
				canvas.addEventListener("click",retryClickListener,false);

				function retryClickListener(evt){
					var mousePos=getMousePos(canvas,evt);
					if(isInside(mousePos,retryButton)){
						canvas.removeEventListener("click",retryClickListener);
						context.clearRect(0,0,width,height);
						playGame();
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
				context.drawImage(carImages[(rightCars[i].color-1)*2],rightCars[i].d,height/2+height/30+height/20-car.height/2+(rightCars[i].lane%2*height/6),car.width,car.height);
				context.drawImage(carImages[(leftCars[i].color-1)*2+1],leftCars[i].d,height/2-height/30-height/6-height/20-car.height/2+(leftCars[i].lane%2*height/6),car.width,car.height);
			}


			//Dashboard
			context.strokeStyle="#000000";
			context.lineWidth="4";
			context.clearRect(0,11*height/12,width/2,height/12);
			context.strokeRect(0,11*height/12,width/2,height/12);
			context.textBaseline="middle";
			context.textAlign="center";
			context.font="20px Arial";
			mph=Math.floor(((car.speed*fps/500)*3600*200)/(12*5280));
			distTraveled=(200*car.xPos/(500*12*5280));
			context.fillText("Speed: "+mph+"mph",width/8,23*height/24);
			context.fillText("Distance Traveled: "+distTraveled.toFixed(2)+"miles",3*width/8,23*height/24);



			//Hitbox Debug
			/*for(var i=0;i<7;i++){
				rect2={
					left:rightCars[i].d+car.width/16,
					right:rightCars[i].d+car.width-car.width/16,
					top:height/2+height/30+height/20-car.height/2+(rightCars[i].lane*height/6)+car.height/16,
					bottom:height/2+height/30+height/20-car.height/2+(rightCars[i].lane*height/6)+car.height-car.height/16
				}
				rect3={
					left:leftCars[i].d+car.width/16,
					right:leftCars[i].d+car.width-car.width/16,
					top:height/2-height/30-height/20-height/6-car.height/2+(leftCars[i].lane*height/6)+car.height/16,
					bottom:height/2-height/30-height/20-height/6-car.height/2+(leftCars[i].lane*height/6)+car.height-car.height/16
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
					y:car.yPos-(7*car.width/8)/2*Math.sin(car.wheelDeg*Math.PI/180)-(4*car.height/5)/2*Math.cos(car.wheelDeg*Math.PI/180)
				}

				var pol1=[p1,p2,p3,p4];
				//console.log("("+p1.x+","+p1.y+")"+","+"("+p2.x+","+p2.y+")"+","+"("+p3.x+","+p3.y+")"+","+"("+p4.x+","+p4.y+")");
				var pol2=[{x:rect2.left,y:rect2.top},{x:rect2.right,y:rect2.top},{x:rect2.right,y:rect2.bottom},{x:rect2.left,y:rect2.bottom}];
				var pol3=[{x:rect3.left,y:rect3.top},{x:rect3.right,y:rect3.top},{x:rect3.right,y:rect3.bottom},{x:rect3.left,y:rect3.bottom}];
				//console.log(pol2[0].x+","+pol2[0].y);
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




			//Phone
			phoneImg=new Image();
			phoneImg.src="images/Phone.png";
			context.drawImage(phoneImg,width/2+(width/2-height/2)/2,0,height/2,height);
			//Math Question
			context.fillStyle="#000000";
			context.textAlign="center";
			context.font="32px Arial";
			context.fillText("What is "+num1+" "+operations[operation]+" "+num2+"?",3*width/4,height/6);

			//Numpad
			context.strokeStyle="#000000";
			context.lineWidth="2";
			//context.strokeRect(3*width/4-3*height/20,height/4,3*height/10,height/2)
			/*//Grid Lines
			//Column Lines
			for(var i=0;i<2;i++){
				context.beginPath();
				context.moveTo((width/2+(width/2-height/2)/2)+(i+2)*height/10,height/4);
				context.lineTo((width/2+(width/2-height/2)/2)+(i+2)*height/10,3*height/4);
				context.stroke();
			}
			//Row Lines
			for(var i=0;i<3;i++){
				context.beginPath();
				context.moveTo((width/2+(width/2-height/2)/2)+height/10,(i+3)*height/8);
				context.lineTo((width/2+(width/2-height/2)/2)+4*height/10,(i+3)*height/8);
				context.stroke();
			}*/
			//Numbers
			context.strokeStyle="#000000";
			context.fillStyle="#000000";
			context.textAlign="center";
			context.font="24px Arial";
			for(var i=0;i<numPad.length;i++){
				context.strokeRect(numPad[i].x-numPad[i].width/2,numPad[i].y,numPad[i].width,numPad[i].height);
				context.fillText(numPad[i].text,numPad[i].x+numPad[i].width/2-numPad[i].width/2,numPad[i].y+numPad[i].height/2);
			}

			context.strokeRect(width/2+(width/2-height/2)/2+height/10,13*height/16,3*height/10,height/16);
			context.textAlign="end";
			context.fillText(userNum+"   ",width/2+(width/2-height/2)/2+4*height/10,13*height/16+height/32);
		}
	}
}