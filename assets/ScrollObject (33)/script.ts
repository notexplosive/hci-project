class ScrollObjectBehavior extends Sup.Behavior {
  awake() {
    this.actor.addBehavior(SpriteActorComponentBehavior).setOffset(0,1);
  }

  update() {
    // Scroll mode needs to be off if there are enemies on screen, and on if not
    if(SCROLL_MODE && HUMAN.getBehavior(HumanMovementBehavior).isMoving()){
      // LocalZ is set by the ZOrder behavior
      this.actor.moveX((this.actor.getLocalZ()+1)*2/-40);
      
      if(this.actor.getPosition().x < -10){
        this.actor.moveX(20);
      }
    }
  }
}
Sup.registerBehavior(ScrollObjectBehavior);
