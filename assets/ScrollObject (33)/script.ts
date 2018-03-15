class ScrollObjectBehavior extends Sup.Behavior {
  awake() {
    if(!this.actor.spriteRenderer){
      this.actor.addBehavior(SpriteActorComponentBehavior).setOffset(0,2);
    }
  }

  update() {
    // Scroll mode needs to be off if there are enemies on screen, and on if not
    if(SCROLL_MODE && HUMAN.getBehavior(HumanMovementBehavior).isMoving()){
      // LocalZ is set by the ZOrder behavior
      this.actor.moveX((this.actor.getLocalZ()+1)*2/-30);
      
      if(this.actor.getPosition().x < -15){
        this.actor.moveX(30);
      }
    }
  }
}
Sup.registerBehavior(ScrollObjectBehavior);
