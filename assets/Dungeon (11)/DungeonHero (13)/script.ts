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
    
  }
  
  gridPosition:{x:number,y:number} = {x:0,y:0}
}
Sup.registerBehavior(DungeonHeroBehavior);
