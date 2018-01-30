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

		this.eatenBoros = 0;
	}

	display() {
		const r = map(noise(this.noff.x), 0, 1, 0, 255);
		const g = map(noise(this.noff.y), 0, 1, 0, 255);
		const b = map(noise(this.noff.z), 0, 1, 0, 255);
		this.col = color(r, g, b);

		noStroke();
		fill(this.col);
		ellipse(this.location.x, this.location.y, this.radius, this.radius);

		// falloff
		this.fOffRadius = map(fOffSlider.value(), 0, 100, this.radius * 1.2, this.radius * 3);
		noFill();
		stroke(255, 100);
		strokeWeight(.5);
		ellipse(this.location.x, this.location.y, this.fOffRadius, this.fOffRadius);

		this.getFat();
		this.label(1);
	}

	update() {
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.limit);
		this.location.add(this.velocity);
		this.acceleration.mult(0);
	}

  applyForce(force) {
		const f = p5.Vector.div(force, this.mass);
		this.acceleration.add(f);
	}

  addNoise(val) {
    this.acceleration.x = map(noise(this.noff.x), 0, 1, -0.1, 0.1);
		this.acceleration.y = map(noise(this.noff.y), 0, 1, -0.1, 0.1);

    this.noff.add(val, val, val);
  }

	getFat() {
		if(this.eatenBoros != 0 && this.eatenBoros % 5 == 0) {
			if(this.radius <= 30){
				this.radius+=.05;
			}
		}
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
  seek(target) {
		const maxS_seek = 10;
		const maxF_seek = 5;

		const desired = p5.Vector.sub(target, this.location);
		desired.setMag(maxS_seek);

		const steer = p5.Vector.sub(desired, this.velocity);
		steer.limit(maxF_seek);

		return steer;
	}

	label(i) {
		noStroke()
		fill(255);
		textSize(this.radius/4);
		const l = "T.0" + i;
		text(l, this.location.x, this.location.y);
	}
}
