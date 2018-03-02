// GLOBAL VARIABLES GO HERE //

// Human Actor. Initialized in awake() phase. Any time after awake() this is a reliable shortcut to the human actor.
let HUMAN:Sup.Actor;

// Map Behavior, we don't care so much about the actor so we just grab the behavior instance.
// Just like HUMAN this is defined in the maps awake() function.
let MAP:MapBehavior;

// List of all enemy actors. A given enemy will be replaced with 'null' if it's no longer present.
// This list should clear every time we transition rooms.
let ENEMIES:Sup.Actor[] = [];

// Some constants
const MELEE_RANGE = 1;
// todo: add sprite_gravity and a few other sprite related things.

// Tells the background elements (like trees) that they should start scrolling to the left.
let SCROLL_MODE = false;

// I find myself doing this a lot, let's optimize!
function getDisplacement(vec1:Sup.Math.Vector2,vec2:Sup.Math.Vector2):Sup.Math.Vector2{
  return vec1.clone().subtract(vec2);
}

function getDistance(vec1:Sup.Math.Vector2,vec2:Sup.Math.Vector2):number{
  return(getDisplacement(vec1,vec2).length())
}

// This function returns the mouse position as it is presented on screen.
// 
// The built-in getMousePosition returns an x,y such that x=0,y=0 is the
// top left corner and x=1,y=1 is the  bottom right corner. Not terribly
// useful for us. But we can convert these values so long as our aspect
// ratio is static (currently set to 16x9)
function getRealMousePosition():Sup.Math.Vector2{
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
// ex: probability(50) returns true 50% of the time
function probability(n:number):boolean{
  return Math.random() > n / 100;
}

// Simple helper function, obtains a random element from a given list.
// Also returns the index that it was obtained from.
function randomElementFrom(a:any[]){
  let index = Math.floor(Math.random()*a.length);
  return [a[index],index];
}