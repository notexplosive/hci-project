class ZOrderBehavior extends Sup.Behavior {
  // HumanMovement uses this, we want to get the y pos of the human, not the sprite (aka, human's feet)
  getPosFrom = this.actor;
  awake() {
    
  }

  update() {
    // Applies the yPosition field and deals with ZOrdering
    let foreground = -this.getPosFrom.getLocalPosition().y*.1;
    this.actor.setLocalZ( foreground );
    this.actor.setLocalScale(2 + foreground,2 + foreground,1)
  }
}
Sup.registerBehavior(ZOrderBehavior);
