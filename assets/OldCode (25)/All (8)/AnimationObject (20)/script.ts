class AnimationNode{
  position:Sup.Math.Vector2;
  size:Sup.Math.Vector2;

  constructor(position,size=null){
    this.position = position;
    this.size = size;
  }
}

class Animation{
  animationNodes:AnimationNode[] = [];
  constructor(list){
    
  }
}

/*
ideal case:
Creates a list of ALL frames with the tweens already filled in
so when the playback happens it just traverses the array.
*/
let anim = new Animation([
  {frame:1,position: {x:1,y:3}},
  {frame:5,},
  {frame:10,position: {x:1,y:3},size : {x:1,y:2}},
  {frame:12,},
  {frame:17,}
]);
