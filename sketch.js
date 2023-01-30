var waveSys;


function setup() {
  createCanvas(windowWidth,windowHeight);
	smooth(5);
	frameRate(60);
	strokeWeight(0.5);
	stroke(255);
	noFill();
	//initialize class with universal x noise scale and noise speed
	waveSys = new NoisyWaves(0.00,1.0010);
}

function draw() {
  background(0);
	waveSys.run();
}

function windowResized(){
	waveSys.adjust();
}


function NoisyWaves(xscale,yspeed){
	this.waves = [];
	this.N = 150;
	for (var i = 0; i < this.N; i++){
		let y_attn = map(i,0,this.N,+height*0.8,height* 1.5);
		this.waves.push(new NoisySine(xscale,yspeed,y_attn,i*-0.1));
	}
}

NoisyWaves.prototype.run = function(){
	for (var i = 0; i < this.N; i++){
		this.waves[i].display();
	}
}
//---call this function below when the window is resized---
NoisyWaves.prototype.adjust = function(){
	for (var i = 0; i < this.N; i++){
		this.waves[i].y_attn = map(i,0,this.N,-height*0.012,height*0.05);
	}
}

/*
	Noisy Sinewave Class
	x_scale & y_speed: around 0.01 is good
	y_attn : y attenuation: around 1/10 to 1/3 of the window height is good
*/

function NoisySine(x_scale_,y_speed_,y_attn_,offset_){
	this.N = 256;
	this.x_scale = x_scale_;
	this.y_speed = y_speed_;
	this.y_attn = y_attn_;
	this.offset = offset_;
}

//completely to scale with current display (no explicitly stated values)
NoisySine.prototype.display = function(){
	var r = 160;
	push();
	translate(width/2,height/2);
	beginShape();
	for (var i = 0; i < this.N; i++){
		let x = norm(i,0,this.N)*width/1.5;
		let y_off = lerp(-this.y_attn,this.y_attn,noise(x*this.x_scale,frameCount*this.y_speed + this.offset));
		// let y = (-H/2)+y_off;
		let theta = radians(x) + PI/2;
		x = r * sin(theta);
		y = r * cos(theta)+y_off/1.6;
		if(frameCount < 90){y = r * cos(theta)+y_off/2};
		if(frameCount < 60){y = r * cos(theta)+y_off/2.3};
		if(frameCount < 30){y = r * cos(theta)+y_off/4.5};
		if (x > height/2) {x = y-y_off/16};
		if (x < -height/2) {x = y+y_off/16};
		curveVertex(x,y);
	}
	endShape();
	// beginShape();
	// ellipse(0, 0, 800, 320);
	// endShape();
	pop();
}