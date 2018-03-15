class TimeIndicatorBehavior extends Sup.Behavior {
  awake() {
    this.actor.setParent(Sup.getActor("Camera"));
    
    if(!this.actor.spriteRenderer){
      new Sup.SpriteRenderer(this.actor,"Graphics/Timebar");
    }
    
    this.actor.spriteRenderer.setAnimation("Fill");
    this.actor.spriteRenderer.pauseAnimation();
    this.actor.setLocalPosition(-.1*this.rotationDirection,3,-4);
  }

  update() {
    if(this.stat){
      let time = this.stat.getTime();
      let maxTime = 15;
      this.actor.spriteRenderer.setAnimationFrameTime(
        time/maxTime * this.actor.spriteRenderer.getAnimationFrameCount());
    }else{
      this.actor.spriteRenderer.setAnimationFrameTime(0);
    }
    this.actor.setEulerZ(this.currentRotZ);
  }
  
  stat:StatBehavior = null;
  rotationDirection = 1;
  currentRotZ = -Math.PI/4;
}
Sup.registerBehavior(TimeIndicatorBehavior);
