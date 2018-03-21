class HomeBehavior extends Sup.Behavior {
  awake() {
    HOME_MODE = true;
  }
  
  start(){
    HUMAN.getBehavior(HumanMovementBehavior).moveTowards(new Sup.Math.Vector2(3.5,-1.5));
  }

  update() {
    if(Sup.Input.wasKeyJustPressed("SPACE")){
      Sup.loadScene("Dungeon");
    }
  }
}
Sup.registerBehavior(HomeBehavior);
