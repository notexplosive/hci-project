/// REFACTIR THIS TO A COMPONENT USED FOR ALL DUNGEON ENTITIES

class DungeonHeroBehavior extends Sup.Behavior {
  awake() {
    Sup.getActor("Camera").setParent(this.actor);
    Sup.getActor("Camera").setLocalPosition(0,0);
  }

  update() {
    let levelActor = CURRENT_DUNGEON_ACTOR;
    if(levelActor){
      let vec = new Sup.Math.Vector2(this.gridPosition.x,this.gridPosition.y);
      vec.add(levelActor.getPosition().toVector2().multiplyScalar(2));
      let target = vec.clone().multiplyScalar(.5).add(0.25,0.5);
      this.actor.move(target.clone().subtract(this.actor.getPosition()).multiplyScalar(0.5));
    }
    
    if(Sup.Input.wasKeyJustPressed("LEFT")){
      this.attemptMove(this.gridPosition.x-1,this.gridPosition.y)
    }
    
    if(Sup.Input.wasKeyJustPressed("RIGHT")){
      this.attemptMove(this.gridPosition.x+1,this.gridPosition.y)
    }
    
    if(Sup.Input.wasKeyJustPressed("DOWN")){
      this.attemptMove(this.gridPosition.x,this.gridPosition.y-1)
    }
    
    if(Sup.Input.wasKeyJustPressed("UP")){
      this.attemptMove(this.gridPosition.x,this.gridPosition.y+1)
    }
  }
  
  attemptMove(x,y){
    if(CURRENT_DUNGEON_FLOORMAP[y][x]){
      this.gridPosition.x = x;
      this.gridPosition.y = y;
    }
  }
  
  gridPosition:{x:number,y:number} = {x:5,y:9}
}
Sup.registerBehavior(DungeonHeroBehavior);
