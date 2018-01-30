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

	display(target){
		this.radius = this.mass * 2;
		noStroke();
		let distance = p5.Vector.sub(target.location, this.location);
		let d = distance.mag();
		if (d < (target.radius + target.fOffRadius)/2) {
			const from = this.col;
			const to = target.col;
			let infVariable = map(infSlider.value(), 0, 100, 0.5, 5);
			let inf = map(d, target.radius, (target.radius + target.fOffRadius)/2, infVariable, 0);
			let kol = lerpColor(from,to,inf);
			fill(kol, 150);
			this.mass += .1;
			this.aim(target.location, kol);
		}
		else {
			fill(this.col, 150);
			this.mass -= .1;
			this.aim(target.location, this.col);
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

	flock(boros, ro, se, al, co) {
		const sep = this.separate(boros);
		const ali = this.align(boros);
		const coh = this.cohesion(boros);
		const roam = this.roam();

		sep.mult(se);
		ali.mult(al);
		coh.mult(co);
		roam.mult(ro);
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

	isInside(target){
		const distance = p5.Vector.sub(target.location, this.location);
		const d = distance.mag();
		if (d <= (target.radius + this.radius)/2){
			return true;
		}else{
			return false;
		}
	}

	aim(target, c) {
		const desired = p5.Vector.sub(target,this.location);
		desired.setMag(this.mass*1.50);
		push();
		translate(this.location.x, this.location.y);
		stroke(c);
		strokeWeight(this.radius/5);
		line(0, 0, desired.x, desired.y);
		pop();
	}
}
