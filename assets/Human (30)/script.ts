class HumanBehavior extends Sup.Behavior {
  awake() {
    HUMAN = this.actor;
    this.actor.addBehavior(HumanMovementBehavior);
  }

  update() {
    if(SCROLL_MODE){
      this.actor.getBehavior(HumanMovementBehavior).moveTowards(new Sup.Math.Vector2(Math.random()-.5,Math.random()-.5).multiplyScalar(3));
      this.actor.spriteRenderer.setHorizontalFlip(true);
    }
  }
}
Sup.registerBehavior(HumanBehavior);
