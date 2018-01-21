class DungeonFloorBehavior extends Sup.Behavior {
  awake() {
    CURRENT_DUNGEON_ACTOR = this.actor;
    CURRENT_DUNGEON_FLOORMAP = [];
    let map = this.actor.tileMapRenderer.getTileMap()
    for(let y = 0; y < map.getHeight(); y++){
      let row = [];
      CURRENT_DUNGEON_FLOORMAP.push(row);
      for(let x = 0; x < map.getWidth(); x++){
        let tile = map.getTileAt(0,x,y);
        row.push()
        if(tile !== -1){
          if(tile === 0){
            this.createTileObject(tile,x,y+1)
            tile = 16;
          }
          if(tile === 1){
            CURRENT_DUNGEON_FLOORMAP[y][x] = true
          }
          this.createTileObject(tile,x,y)
        }
      }
    }
    this.actor.tileMapRenderer.destroy();
    
    Sup.log(CURRENT_DUNGEON_FLOORMAP);
  }

  update() {
    for(let tileObj of this.tileObjects){
      let act  = tileObj.actor;
      let vec = new Sup.Math.Vector2(tileObj.x,tileObj.y);
      let displace = vec.clone().subtract(act.getLocalPosition().toVector2()).multiplyScalar(.1);
      act.moveLocal(displace);
      
      // Possible optimization here if doing this many length calls is too slow
      if(displace.length() < .005){
        act.setLocalPosition(vec);
      }
      
      let mp = getRealMousePosition();
      mp.add(Sup.getActor("Camera").getPosition());
      if( Math.abs(act.getPosition().x - mp.x) < .25 && Math.abs(act.getPosition().y - mp.y) < .25 ){
        act.spriteRenderer.setOpacity(.5);
      }else{
        act.spriteRenderer.setOpacity(1);
      }
    }
  }
  
  createTileObject(tile,x,y){
    let tileActor = new Sup.Actor("mapTile"+x+","+y,this.actor);
    tileActor.setLocalPosition(Math.random() * 100 - 50,Math.random() * 100 - 50,.1)

    let tileSpriteRenderer = new Sup.SpriteRenderer(tileActor,"Graphics/Tiles");
    tileSpriteRenderer.setAnimation("All");
    tileSpriteRenderer.setAnimationFrameTime(tile);
    tileSpriteRenderer.pauseAnimation();
    
    // TODO:
    // Ideally next time a map is generated we can just refresh these objects
    this.tileObjects.push({actor:tileActor,x:x/2+1/4,y:y/2+1/4})
    return tileActor;
  }
  
  private tileObjects:{actor:Sup.Actor,x:number,y:number}[] = []
}
Sup.registerBehavior(DungeonFloorBehavior);
