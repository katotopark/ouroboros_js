let ouro, ouArray;

class OuroSystem {
  constructor() {
    ouArray = [];
    ouro = new Ouro();
    ouArray.push(ouro);
  }

  runOuros(prtgnst, prprty) {
    const ouArrMap = ouArray.map((ou) => {
  		ou.display();
  		ou.checkEdges();

  		if(prtgnst && mouseIsPressed) {
  			const mouse = createVector(pmouseX, pmouseY);
  			ou.applyForce(ou.seek(mouse));
  		} else {
  			ou.addNoise(prprty);
  		}
  		ou.update();
  	});
  }
  popOuros() {

  }
}
