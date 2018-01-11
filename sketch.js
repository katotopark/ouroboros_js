const boArr = new Array(30);
const tolValScale = 15;
let marginX, marginY;

function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	// UI env
	tolSlider = createSlider(0, 100, 70).style('width', '60px');
	tolSlider.position(20, 20);
	boSlider = createSlider(0, 100, 80).style('width', '60px');
	boSlider.position(20, 50);

	// UI ouro
	infSlider = createSlider(0, 100, 50).style('width', '60px');
	infSlider.position(20, 80);
	fOffSlider = createSlider(0, 100, 50).style('width', '60px');
	fOffSlider.position(20, 110);
	propSlider = createSlider(0, 100, 0).style('width', '60px');
	propSlider.position(20, 140);
	prtgnstButton = createButton('protagonist');
	prtgnstButton.position(20, 170);
	popUpButton = createButton('pop-up');
	popUpButton.position(prtgnstButton.width + prtgnstButton.x * 2, 170);

	// UI boro
	populationSlider = createSlider(0, 100, 0).style('width', '60px');
	populationSlider.position(20, 200);
	obedienceSlider = createSlider(0, 100, 0).style('width', '60px');
	obedienceSlider.position(20, 230);
	ambitionSlider = createSlider(0, 100, 0).style('width', '60px');
	ambitionSlider.position(20, 260);

	marginX = width/map(tolSlider.value(), 0, 100, 100, 0)*tolValScale;
	marginY = height/map(tolSlider.value(), 0, 100, 100, 0)*tolValScale;


	ou = new Ouro();

	for(var i = 0; i < boArr.length; i++){
		boArr[i] = new Boro();
	}

}

function draw() {
	fill(0);
	noStroke();
	background(0);

	// sliders ////////////
	textSize(8);
	// UI (env): tolerance
	const tolVal = map(tolSlider.value(), 0, 100, 100, 20);
	fill(255);
	text("TOLERANCE",
		tolSlider.width + tolSlider.x * 2, 30);

	// UI (env): boundary denial
	const boVal = map(boSlider.value(), 0, 100, 255, 0);
	text("BOUNDARY DENIAL",
		boSlider.width + boSlider.x * 2, 60);

	// UI (ouro): influence
	const infVal = map(infSlider.value(), 0, 100, 0, 100);
	text("INFLUENCE", infSlider.width + infSlider.x * 2, 90);
	// UI (ouro): falloff
	const fOffVal = map(fOffSlider.value(), 0, 100, 0, 100);
	text("FALLOFF", fOffSlider.width + fOffSlider.x * 2, 120);
	// UI (ouro): property
	const propVal = map(propSlider.value(), 0, 100, 0, 100);
	text("PROPERTY", propSlider.width + propSlider.x * 2, 150);
	// UI (ouro): protagonist
	// UI (ouro): pop-up

	// UI (boro): population
	const populationVal = map(populationSlider.value(), 0, 100, 0, 100);
	text("POPULATION", populationSlider.width + populationSlider.x * 2, 210);
	// UI (boro): obedience
	const obedienceVal = map(obedienceSlider.value(), 0, 100, 0, 100);
	text("OBEDIENCE", obedienceSlider.width + obedienceSlider.x * 2, 240);
	// UI (boro): ambition
	const ambitionVal = map(ambitionSlider.value(), 0, 100, 0, 100);
	text("AMBITION", ambitionSlider.width + ambitionSlider.x * 2, 270);

	// environment
	noFill();
	stroke(255, boVal);
	strokeWeight(map(boSlider.value(), 0, 100, 2, 0));
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
		boro.display(ou);
		boro.checkEdges();
		let seeked = boro.seek(ou.location);
		boro.applyForce(seeked);
		boro.flock(boArr);
		boro.update();
	})
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Ouro {
	constructor() {
		this.mass = 5;
		this.radius = this.mass * 4;

		const initX = getRandomFloat((width - marginX + this.radius)/2, (width + marginX - this.radius)/2);
		const initY = getRandomFloat((height - marginY + this.radius)/2, (height + marginY - this.radius)/2);

		this.location = createVector(initX, initY)
		this.velocity = createVector();
		this.acceleration = createVector();

		this.noff = createVector(random(100), random(100), random(100));
		this.limit = .25;
	}

	display() {
		let r = map(noise(this.noff.x), 0, 1, 0, 255);
		let g = map(noise(this.noff.y), 0, 1, 0, 255);
		let b = map(noise(this.noff.z), 0, 1, 0, 255);
		this.col = color(r, g, b);

		noStroke();
		fill(this.col);
		ellipse(this.location.x, this.location.y, this.radius, this.radius);

		// falloff
		this.fOffRadius = map(fOffSlider.value(), 0, 100, this.radius * 1.2, this.radius * 3);
		noFill();
		stroke(255);
		strokeWeight(.5);
		ellipse(this.location.x, this.location.y, this.fOffRadius, this.fOffRadius);
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
		if (this.location.x < (width - marginX + this.radius)/2){
			this.location.x = (width - marginX + this.radius)/2;
			this.velocity.mult(-1);
		}
		else if (this.location.x > (width + marginX - this.radius)/2){
			this.location.x = (width + marginX - this.radius)/2;
			this.velocity.mult(-1);
		}
		if (this.location.y < (height - marginY + this.radius)/2){
			this.location.y = (height - marginY + this.radius)/2;
			this.velocity.mult(-1);
		}
		else if (this.location.y > (height + marginY - this.radius)/2){
			this.location.y = (height + marginY - this.radius)/2;
			this.velocity.mult(-1);
		}
	}
}

class Boro extends Ouro {
	constructor() {
		super();
		this.mass = 2;
		this.col = color(255);
		this.limit = .2;
		this.maxSpeed = 2;
		this.maxForce = 1;

		this.noff = createVector(random(100), random(100), random(100));
	}

	display(ou){
		this.radius = this.mass * 2;
		noStroke();
		let distance = p5.Vector.sub(ou.location, this.location);
		let d = distance.mag();
		if (d < (ou.radius + ou.fOffRadius)/2) {
			const from = this.col;
			const to = ou.col;
			let infVariable = map(infSlider.value(), 0, 100, 0.5, 5);
			let inf = map(d, ou.radius, (ou.radius + ou.fOffRadius)/2, infVariable, 0);
			let kol = lerpColor(from,to,inf);
			fill(kol, 200);
			this.mass += .1;
		}
		else {
			fill(this.col, 200);
			this.mass -= .1;
		}
		this.mass = constrain(this.mass, 2, 5);
		ellipse(this.location.x, this.location.y, this.radius, this.radius);
	}

	update() {
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.limit);
		this.location.add(this.velocity);
		this.acceleration.mult(0);

	}

	roam() {
		let roamVector = createVector()
		roamVector.x = map(noise(this.noff.x), 0, 1, -.5, .5);
		roamVector.y = map(noise(this.noff.y), 0, 1, -.5, .5);
		this.noff.add(0.001, 0.001, 0.001);
		return roamVector;
	}

	applyForce(force) {
		const f = p5.Vector.div(force, this.mass);
		this.acceleration.add(f);
	}

	flock(boros) {
		const sep = this.separate(boros);
		const ali = this.align(boros);
		const coh = this.cohesion(boros);
		const roam = this.roam();

		sep.mult(2);
		ali.mult(1);
		coh.mult(1);
		roam.mult(3);
		this.applyForce(sep);
		this.applyForce(ali);
		this.applyForce(coh);
		this.applyForce(roam);
	}

	seek(target) {
		const maxS_seek = 1;
		const maxF_seek = .5;

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

		boros.map((bo) => {
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

		boros.map((bo) => {
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

		boros.map((bo) => {
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
