class DungeonHeroBehavior extends Sup.Behavior {
  awake() {
    // Eventually the hero should be his own sprite, this is just for demonstration/testing
    createTilePatch(this.actor,
                   [
      [14,15],
      [30,31]
    ]);
  }

  update() {
    let levelActor = CURRENT_DUNGEON_ACTOR;
    if(levelActor){
      let vec = new Sup.Math.Vector2(this.gridPosition.x,this.gridPosition.y);
      this.actor.move(levelActor.getPosition().toVector2().add(vec.clone().subtract(this.actor.getPosition()).multiplyScalar(.5)))
    }
  }
  
  gridPosition:{x:number,y:number} = {x:10,y:8}
}
Sup.registerBehavior(DungeonHeroBehavior);
