class CursorBehavior extends Sup.Behavior {
  awake() {
    Sup.Input.setMouseVisible(false);
  }

  update() {
    let m = getRealMousePosition();
    this.actor.setPosition(m.x+0.5,m.y-0.5,4.5);
  }
}
Sup.registerBehavior(CursorBehavior);
