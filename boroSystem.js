let boArray, population;

class BoroSystem {
  constructor(population) {
    boArray = new Array(population);
    for(var i = 0; i < boArray.length; i++){
  		boArray[i] = new Boro();
  	}
  }

  runBoros(target, ro, se, al, co) {
    const boArrRun = boArray.map((boro) => {
  		boro.display(target);
  		boro.checkEdges();
  		let seeked = boro.seek(target.location);
  		boro.applyForce(seeked);
  		boro.flock(boArray, ro, se, al, co);
      boro.update();
    });
  }

  removeBoros(target) {
    const boArrRmv = boArray.map((boro) => {
      if(boro.isInside(target)) {
  			const index = boArray.indexOf(boro);
  	    if (index !== -1) {
  				target.eatenBoros++;
  	      boArray.splice(index, 1);
  				boArray.push(new Boro());
  	    }
  		}
    });
  }

  updatePopulation(newPopulation) {
    let tempBoro = newPopulation - population;

    if(tempBoro > 0) {
      for(var i = 0; i < tempBoro; i++){
        let bornBoro = new Boro();
        boArray.push(bornBoro);
      }
    } else {
      for(var i = boArray.length - newPopulation; i >= 0; i--) {
        let shortBoArray = shorten(boArray);
      }
    }
    population = newPopulation;
  }
}
