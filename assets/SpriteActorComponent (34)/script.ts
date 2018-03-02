// Utility Class. The idea is you can attach this behavior to an actor and it will get a "SpriteActor"
// that is parented to this.actor. Useful for ZOdering since you want the object's position to be at 
// the foot of its sprite.
// It also assigns the spriteActor spriteRenderer to this.actor.spriteRenderer so you never actually 
// have to interact with this class beyond defining the offset.
class SpriteActorComponentBehavior extends Sup.Behavior {
  awake() {
    this.spriteActor = new Sup.Actor("SpriteActor",this.actor);
    this.actor.spriteRenderer = new Sup.SpriteRenderer(this.spriteActor);
    this.actor.addBehavior(ZOrderBehavior);
  }

  update() {
    this.spriteActor.setLocalPosition(this.offset);
  }
  
  setOffset(x,y){
    this.offset = new Sup.Math.Vector2(x,y);
  }
  
  getSpriteActor(){
    return this.spriteActor;
  }
  
  private offset:Sup.Math.Vector2 = new Sup.Math.Vector2(0,0);
  private spriteActor:Sup.Actor = null;
}
Sup.registerBehavior(SpriteActorComponentBehavior);
