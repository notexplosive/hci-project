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
    
    if(Sup.Input.wasMouseButtonJustPressed(0) || Sup.Input.wasTouchStarted(0)){
      if(!Sup.Input.wasMouseButtonJustPressed(0)){
        mp = tp;
      }
      
      Sup.getActor("Player").getBehavior(HumanMovementBehavior).moveTowards(new Sup.Math.Vector2(mp.x,mp.y));
      
    }
  }
}
Sup.registerBehavior(GameBehavior);