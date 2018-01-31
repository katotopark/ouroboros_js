const tolValScale = 15;
let marginX, marginY;
let env, ouSys, boSys;
let prtgnst = false;
		popUp 	= false ;

function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

function preload() {
	uiFont = loadFont('assets/InputMonoCompressed-Medium.ttf');
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	cntrls = new Controls();

	marginX = width/map(tolSlider.value(), 0, 100, 100, 0)*tolValScale;
	marginY = height/map(tolSlider.value(), 0, 100, 100, 0)*tolValScale;

	env = new Environment();
	ouSys = new OuroSystem();
	boSys = new BoroSystem(20);

	prtgnstButton.mouseClicked(() => {
		prtgnst = true;
	});

	popUpButton.mouseClicked(() => {
		popUp = true;
	});
}

function draw() {
	background(0);

	cntrls.interact();

	marginX = width/tolVal*tolValScale;
	marginY = height/tolVal*tolValScale;

	env.area(marginX, marginY);
	env.grid(marginX, marginY, 20);

	ouSys.runOuros(prtgnst, propVal);
	ouSys.popOuros();
	boSys.runBoros(ouro, 5, ambitionVal, obedienceVal, 1);
	boSys.removeBoros(ouro);
	boSys.updatePopulation(populationVal);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function Controls() {
	// UI env
	tolSlider = createSlider(0, 100, 50).class('sliders');
	tolSlider.position(20, 20);
	boSlider = createSlider(0, 100, 0).class('sliders');
	boSlider.position(20, 50);

	// UI ouro
	infSlider = createSlider(0, 100, 0).class('sliders');
	infSlider.position(20, 80);
	fOffSlider = createSlider(0, 100, 50).class('sliders');
	fOffSlider.position(20, 110);
	propSlider = createSlider(0, 100, 50).class('sliders');
	propSlider.position(20, 140);
	prtgnstButton = createButton('PROTAGONIST').class('buttons');
	prtgnstButton.position(20, 170);
	popUpButton = createButton('POP-UP').class('buttons');
	popUpButton.position(prtgnstButton.width + prtgnstButton.x/4, 170);

	// UI boro
	populationSlider = createSlider(0, 100, 0).class('sliders');
	populationSlider.position(20, 200);
	obedienceSlider = createSlider(0, 100, 50).class('sliders');
	obedienceSlider.position(20, 230);
	ambitionSlider = createSlider(0, 100, 50).class('sliders');
	ambitionSlider.position(20, 260);
}
Controls.prototype.interact = function() {
	// sliders ////////////
	textSize(9);
	textFont(uiFont);
	// UI (env): tolerance
	tolVal = map(tolSlider.value(), 0, 100, 100, 20);
	fill(255);
	text("TOLERANCE",
		100, 30);

	// UI (env): boundary denial
	boVal = map(boSlider.value(), 0, 100, 255, 0);
	text("BOUNDARY DENIAL",
		100, 60);

	// UI (ouro): influence
	infVal = map(infSlider.value(), 0, 100, 0, 50);
	text("INFLUENCE", 100, 90);
	// UI (ouro): falloff
	fOffVal = map(fOffSlider.value(), 0, 100, 0, 100);
	text("FALLOFF", 100, 120);
	// UI (ouro): property
	propVal = map(propSlider.value(), 0, 100, 0.01, 1);
	text("PROPERTY", 100, 150);
	// UI (ouro): protagonist
	// UI (ouro): pop-up

	// UI (boro): population
	populationVal = map(populationSlider.value(), 0, 100, 20, 200);
	text("POPULATION", 100, 210);
	// UI (boro): obedience
	obedienceVal = map(obedienceSlider.value(), 0, 100, 50, 1);
	text("OBEDIENCE", 100, 240);
	// UI (boro): ambition
	ambitionVal = map(ambitionSlider.value(), 0, 100, 1, 50);
	text("AMBITION", 100, 270);

}
