class HomePanInBehavior extends Sup.Behavior {
  awake() {
    this.targetPosition = this.actor.getPosition().toVector2();
    this.actor.setLocalPosition(this.offset);
  }

  update() {
    this.actor.moveLocal(this.targetPosition.clone().subtract(this.actor.getPosition()).multiplyScalar(.1));
  }
  
  offset:Sup.Math.Vector2 = new Sup.Math.Vector2(0,0);
  private targetPosition:Sup.Math.Vector2;
}
Sup.registerBehavior(HomePanInBehavior);
