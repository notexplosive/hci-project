// Global Variables
let CURRENT_DUNGEON_ACTOR:Sup.Actor;

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

// Creates a set of tiles as sprites based on an array and acting parent.
function createTilePatch(parent:Sup.Actor,rows:number[][]){
  let x = -1;
  let y = -1;
  let tileActors:Sup.Actor[] = []
  
  for(let row of rows){
    y++;
    x=0;
    if(!row){ continue }
    for(let tileIndex of row){
      x++;
      if(!tileIndex){ continue }
      let tileActor = new Sup.Actor(parent.getName() + "tile" + x + "," + y,parent);
      let renderer = new Sup.SpriteRenderer(tileActor);
      renderer.setSprite("Graphics/Tiles");
      renderer.setAnimation("All");
      renderer.setAnimationFrameTime(tileIndex);
      renderer.pauseAnimation();
      
      tileActor.setLocalPosition(x/2,-y/2);
      tileActors.push(tileActor);
    }
  }
  
  for(let actor of tileActors){
    actor.moveX(-x/4 -x/8)
    actor.moveY(y/4)
  }
}