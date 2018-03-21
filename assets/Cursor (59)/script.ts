class CursorBehavior extends Sup.Behavior {
  awake() {
    if(!this.actor.spriteRenderer){
      let sp = new Sup.SpriteRenderer(this.actor);
      sp.setSprite("Graphics/Cursor");
    }
    Sup.Input.setMouseVisible(false);
  }

  update() {
    let m = getRealMousePosition();
    this.actor.setPosition(m.x+0.5,m.y-0.5,4.9);
  }
}
Sup.registerBehavior(CursorBehavior);
