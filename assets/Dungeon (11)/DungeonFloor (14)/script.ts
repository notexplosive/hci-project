class DungeonFloorBehavior extends Sup.Behavior {
  awake() {
    let map = this.actor.tileMapRenderer.getTileMap()
    for(let y = 0; y < map.getHeight(); y++){
      for(let x = 0; x < map.getWidth(); x++){
        let tile = map.getTileAt(0,x,y);
        if(tile !== -1){
          let tileActor = new Sup.Actor("mapTile"+x+","+y,this.actor);
          tileActor.setLocalPosition(Math.random() * 50 - 25,Math.random() * 50 - 25,.1)
          //tileActor.setLocalPosition(x/2,y/2);
          //tileActor.moveLocal(1/4,1/4);
          
          let tileSpriteRenderer = new Sup.SpriteRenderer(tileActor,"Graphics/Tiles");
          tileSpriteRenderer.setAnimation("All");
          tileSpriteRenderer.setAnimationFrameTime(tile);
          tileSpriteRenderer.pauseAnimation();
          
          // TODO:
          // Ideally next time a map is generated we can just refresh these objects
          this.tileObjects.push({actor:tileActor,x:x/2+1/4,y:y/2+1/4})
        }
      }
    }
    this.actor.tileMapRenderer.destroy();
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
  
  private tileObjects:{actor:Sup.Actor,x:number,y:number}[] = []
}
Sup.registerBehavior(DungeonFloorBehavior);
