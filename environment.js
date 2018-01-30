class Environment {
  area(mrgX, mrgY) {
    noFill();
  	stroke(255, map(boSlider.value(), 0, 100, 200, 0));
  	strokeWeight(map(boSlider.value(), 0, 100, 2, 0));
  	rectMode(CENTER);
  	rect(width/2, height/2, mrgX, mrgY);
  }

  grid(mrgX, mrgY, spacing) {
    stroke(255);
  	strokeWeight(map(tolSlider.value(), 0, 100, 2, .8));
    for(var i = (width - mrgX + spacing)/2 ;
  		i < (width + mrgX)/2; i+=spacing){
  		for(var j = (height - mrgY + spacing)/2;
  			j < (height + mrgY)/2; j+=spacing){
  			point(i,  j);
  		}
  	}
  }
}
