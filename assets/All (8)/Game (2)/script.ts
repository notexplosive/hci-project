class GameBehavior extends Sup.Behavior {
  awake() {
    let cameraActor = new Sup.Actor("Camera");
    cameraActor.setPosition(0,0,5);
    let cameraComponent = new Sup.Camera(cameraActor);
    cameraComponent.setOrthographicMode(true);
    cameraComponent.setOrthographicScale(8);
  }
  
  update() {
    let mp = getRealMousePosition();
    let tp = Sup.Input.getTouchPosition(0);
    let LEVEL = "DUNGEON"
    
    if(LEVEL == "HOME" && Sup.Input.wasMouseButtonJustPressed(0) || Sup.Input.wasTouchStarted(0)){
      if(!Sup.Input.wasMouseButtonJustPressed(0)){
        mp = tp;
      }
      
      let item = new Sup.Actor("Item");
      item.setPosition(mp.x,mp.y);
      item.setEulerZ(Math.random() * Math.PI * 2);
      
      // TODO(wyatt): This is really ugly and I should retool this.
      let r = Math.floor(Math.random()*5 + 1);
      let slotNames = ["hat","shirt","pants","sword","shield"]
      let equipmentBehavior = item.addBehavior(EquipmentBehavior);
      
      // TODO(wyatt): We should reconsider how this slot/index thing works.
      // Ideally slot should be "which sprite sheet do I pull from"
      // and Index is "where do I go in that sprite sheet."
      equipmentBehavior.slot = slotNames[r]
      equipmentBehavior.index = r;
      
      new Sup.SpriteRenderer(item,"Graphics/SampleHero");
      item.spriteRenderer.setAnimation("All");
      item.spriteRenderer.setAnimationFrameTime(r);
      item.spriteRenderer.pauseAnimation();
      
      Sup.getActor("Hero").getBehavior(HeroWanderBehavior).pushPointOfInterest(item.getPosition().toVector2());
    }
  }
}
Sup.registerBehavior(GameBehavior);