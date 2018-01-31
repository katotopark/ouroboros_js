let ouro, ouArray;

class OuroSystem {
  constructor() {
    ouArray = [];
    ouro = new Ouro();
    ouArray.push(ouro);
  }

  runOuros(protagonist, prprty) {
    const ouArrMap = ouArray.map((ou) => {
  		ou.display();
  		ou.checkEdges();

  		if(protagonist) {
  			const mouse = createVector(pmouseX, pmouseY);
  			ou.applyForce(ou.seek(mouse));
  		} else {
  			ou.addNoise(prprty);
  		}
  		ou.update();
  	});
  }
  popOuros() {
    if(popUp && ouArray.length <= 3) {
      const ouArrMap = ouArray.map((ou) => {
        if(ou.eatenBoros > 0 && ou.eatenBoros % 10 == 0) {
          console.log('popping');
          ouArray.push(new Ouro());
          ou.eatenBoros = 1;
        }
      });
    }
  }
}
