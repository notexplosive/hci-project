// This function returns the mouse position as it is presented on screen.
// 
// The built-in getMousePosition returns an x,y such that x=0,y=0 is the
// top left corner and x=1,y=1 is the  bottom right corner. Not terribly
// useful for us. But we can convert these values so long as our aspect
// ratio is static (currently set to 16x9)
function getRealMousePosition(){
  let mp = Sup.Input.getMousePosition();
  // Conversion factor, found via experimentation.
  let sf = .45;
  mp.x *= Sup.Game.getScreenRatio().width * sf;
  mp.y *= Sup.Game.getScreenRatio().height * sf;
  return mp;
}

// Take in an actor and scales up their image based on their y position.
function scaleWithZOrder(act){
    let scl = 10 / (this.actor.getPosition().y + 10);
    this.actor.setLocalScale(scl,scl,1);
}

// Cleaner way to represent randomness.
// 
// ex: probability(50) returns true 50% of the time
function probability(n:number){
  return Math.random() > n / 100;
}

// Simple helper function, obtains a random element from a given list.
// Also returns the index that it was obtained from.
function randomElementFrom(a:any[]){
  let index = Math.floor(Math.random()*a.length);
  return [a[index],index];
}