class HumanBehavior extends Sup.Behavior {
  awake() {
    HUMAN = this.actor;
    this.actor.addBehavior(HumanMovementBehavior);
  }

  update() {
    
  }
}
Sup.registerBehavior(HumanBehavior);
