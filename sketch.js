const boArr = new Array(100);
function setup() {
	createCanvas(windowWidth, windowHeight);

	tolSlider = createSlider(0, 100, 70);
	tolSlider.position(20, 20);
	boSlider = createSlider(0, 100, 0);
	boSlider.position(20, 50);
	ou = new Ouro();

	for(var i = 0; i < boArr.length; i++){
		boArr[i] = new Boro();
	}
	fill(0);
	noStroke();
}

function draw() {
	background(0);

	// sliders ////////////

	// UI: tolerance
	tolVal = map(tolSlider.value(), 0, 100, 100, 20);
	const tolValScale = 15;
	// strokeWeight(0.8);
	fill(255);
	text("TOLERANCE",
		tolSlider.width + tolSlider.x * 2, 30);

	// UI: boundary denial
	boVal = map(boSlider.value(), 0, 100, 255, 0);
	text("BOUNDARY DENIAL",
		boSlider.width + boSlider.x * 2, 60);

	// environment
	noFill();
	stroke(255, boVal);
	strokeWeight(2);
	rectMode(CENTER);
	marginX = width/tolVal*tolValScale;
	marginY = height/tolVal*tolValScale;
	rect(width/2, height/2, marginX, marginY);

	// environment: dot grid
	stroke(255);
	strokeWeight(2);
	const spacing = 20;
	for(var i = (width - marginX + spacing)/2 ;
		i < (width + marginX)/2; i+=20){
		for(var j = (height - marginY + spacing)/2;
			j < (height + marginY)/2; j+=20){
			point(i,  j);
		}
	}

	ou.display();
	ou.checkEdges();
	ou.update();

	boArr.forEach((boro) => {
		boro.display();
		boro.checkEdges();
		boro.update();
		let seeked = boro.seek(ou.location);
		boro.applyForce(seeked);
		boro.flock(boArr);
	})
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Ouro {
	constructor() {
		this.mass = 5;
		this.radius = this.mass * 8;
		this.location = createVector(random(width), random(height))
		this.velocity = createVector();
		this.acceleration = createVector();
		this.noff = createVector(random(100), random(100), random(100));
		this.limit = 1;
		// console.log(marginX);
	}

	display() {
		noStroke();
		fill(255);
		ellipse(this.location.x, this.location.y,
				this.radius, this.radius);
	}

	update() {
		this.acceleration.x = map(noise(this.noff.x), 0, 1, -0.1, 0.1);
		this.acceleration.y = map(noise(this.noff.y), 0, 1, -0.1, 0.1);

		this.velocity.add(this.acceleration);
		this.velocity.limit(this.limit);
		this.location.add(this.velocity);
		this.acceleration.mult(0);
		this.noff.add(0.01, 0.01, 0.01);
	}

	checkEdges() {
		if (this.location.x < this.radius/2){
			this.location.x = this.radius/2;
			this.velocity.mult(-1);
		}
		else if (this.location.x > width - this.radius/2){
			this.location.x = width - this.radius/2;
			this.velocity.mult(-1);
		}
		if (this.location.y < this.radius/2){
			this.location.y = this.radius/2;
			this.velocity.mult(-1);
		}
		else if (this.location.y > height - this.radius/2){
			this.location.y = height - this.radius/2;
			this.velocity.mult(-1);
		}
	}
}

class Boro extends Ouro {
	constructor() {
		super();
		this.mass = 2;
		this.radius = this.mass * 2;
		this.limit = .5;
		this.maxSpeed = 2;
		this.maxForce = 1;

		this.location = createVector(random(width), random(height))
		this.velocity = createVector();
		this.acceleration = createVector();
		this.noff = createVector(random(100), random(100), random(100));
	}

	display(){
		noStroke();
		fill(185, 218, 51);
		ellipse(this.location.x, this.location.y,
				this.radius, this.radius);
	}

	update() {
		// this.acceleration.x = map(noise(this.noff.x), 0, 1, -0.01, 0.01);
		// this.acceleration.y = map(noise(this.noff.y), 0, 1, -0.01, 0.01);

		this.velocity.add(this.acceleration);
		this.velocity.limit(this.limit);
		this.location.add(this.velocity);
		this.acceleration.mult(0);
		// this.noff.add(0.01, 0.01, 0.01);
	}

	applyForce(force) {
		const f = p5.Vector.div(force, this.mass);
		this.acceleration.add(f);
	}

	flock(boros) {
		const sep = this.separate(boros);
		const ali = this.align(boros);
		const coh = this.cohesion(boros);

		sep.mult(2);
		ali.mult(2);
		coh.mult(1);
		this.applyForce(sep);
		this.applyForce(ali);
		this.applyForce(coh);
	}

	seek(target) {
		const maxS_seek = 1;
		const maxF_seek = 5;

		const desired = p5.Vector.sub(target, this.location);
		desired.setMag(maxS_seek);

		const steer = p5.Vector.sub(desired, this.velocity);
		steer.limit(maxF_seek);

		return steer;
	}

	align(boros) {
		const nghbrDist = 10;
		const sum = createVector();
		let count = 0;

		boros.forEach((bo) => {
			let d = p5.Vector.dist(this.location, bo.location);
			if ((d > 0) && (d < nghbrDist)) {
				sum.add(bo.velocity);
				count++;
			}
		});
		if (count > 0) {
			sum.div(count);
	    sum.normalize();
	    sum.mult(this.maxspeed);
	    let steer = p5.Vector.sub(sum,this.velocity);
	    steer.limit(this.maxforce);
	    return steer;
	  }
		else {
	    return createVector(0,0);
	  }
	}

	separate(boros) {
		const desiredSeparation = this.mass * 5;
		const steer = createVector();
		let count = 0;

		boros.forEach((bo) => {
			let d = p5.Vector.dist(this.location, bo.location);
			if ((d > 0) && (d < desiredSeparation)) {
					let diff = p5.Vector.sub(this.location, bo.location);
					diff.normalize();
					diff.div(d);
					steer.add(diff);
					count++;
			}
		});
			if (count > 0) {
				steer.div(count);
			}
			if (steer.mag() > 0) {
				steer.normalize();
		    steer.mult(this.maxSpeed);
		    steer.sub(this.velocity);
		    steer.limit(this.maxforce);
			}
			return steer;
	}
	cohesion(boros) {
		const nghbrDist = 10;
		const sum = createVector();
		let count = 0;

		boros.forEach((bo) => {
			let d = p5.Vector.dist(this.location, bo.location);
			if ((d > 0) && (d < nghbrDist)) {
				sum.add(bo.velocity);
				count++;
			}
		});
		if (count > 0) {
	    sum.div(count);
	    return this.seek(sum);  // Steer towards the location
	  }
		else {
	    return createVector(0,0);
	  }
	}
}
