class HumanMovementBehavior extends Sup.Behavior {
  private targetPosition:Sup.Math.Vector2 = new Sup.Math.Vector2(0,0);
  private longTermTargetPosition:Sup.Math.Vector2 = new Sup.Math.Vector2(0,0);
  private waitframes:number = 0;
  private spriteActor:Sup.Actor = null;
  private spriteActorVars = {
    yVelocity:0,
    yPosition:0
  };
  private nextTargetPosition:Sup.Math.Vector2 = null;
  
  awake() {
    this.spriteActor = new Sup.Actor("HumanSprite",this.actor);
    this.spriteActor.addBehavior(ZOrderBehavior).getPosFrom = this.actor;
    new Sup.SpriteRenderer(this.spriteActor,"Graphics/Hero");
    this.spriteActor.setLocalScale(2,2,1);
    
    // This is weird. I would never advise doing this normally.
    this.actor.spriteRenderer = this.spriteActor.spriteRenderer;
    
    this.actor.addBehavior(StatBehavior);
  }

  update() {
    // TODO: We can handle collision by disallowing certain target positions? Re-clamping them to the nearest allowed location?
    // This would have to apply to even intermediary target positions, not just long term.
    
    // ---------------------------------------- WAITFRAME BOUNDARY ------------------------------------
    // Wait out the waitframes
    if(this.waitframes > 0){
      this.waitframes--;
      return;
    }
    
    // Handle sprite graphic
    this.spriteActorVars.yPosition += this.spriteActorVars.yVelocity;
    if(this.spriteActorVars.yPosition < 0){
      this.spriteActorVars.yPosition = 0;
    }
    this.spriteActorVars.yVelocity -= .05;
    if(this.spriteActorVars.yPosition < 0){
      this.spriteActorVars.yPosition = 0;
      this.spriteActorVars.yVelocity = 0;
      this.spriteActor.setEulerZ(0);
    }
    
    if(this.spriteActorVars.yPosition == 0){
      this.spriteActor.setEulerZ(0);
    }
    
    // Applies yPosition
    this.spriteActor.setLocalPosition(0,this.spriteActorVars.yPosition*.1 + 1 );
    
    // Interpolate towards position
    let displacement = this.targetPosition.clone().subtract(this.actor.getPosition().toVector2());
    if(displacement.length() > 0.000001){
      let distancePerFrame = .04;
      if(displacement.length() > distancePerFrame){
        this.actor.move(displacement.normalize().multiplyScalar(distancePerFrame));
      }else{
        if(this.spriteActorVars.yPosition == 0){
          this.actor.setPosition(this.targetPosition);
          this.setTargetPosition(this.longTermTargetPosition);
          this.wait(2);
        }
      }
    }else{
      let longTermDisplacement = this.longTermTargetPosition.clone().subtract(this.actor.getPosition().toVector2());
      if(longTermDisplacement.length() > 0.000001){
        if(this.spriteActorVars.yPosition == 0){
          this.setTargetPosition(this.longTermTargetPosition);
        }
      }
    }
    
    // Bug: accumulates taller and taller heights
    
    if(this.nextTargetPosition && this.spriteActorVars.yPosition == 0){
      this.setTargetPosition(this.nextTargetPosition);
      this.nextTargetPosition = null;
      // this.setTargetPosition(this.nextTargetPosition);
      this.wait(5);
    }
  }
  
  // Public facing method for movement
  moveTowards(targetPosition:Sup.Math.Vector2){
    this.nextTargetPosition = targetPosition;
  }
  
  // Internal method for movement
  private setTargetPosition(target:Sup.Math.Vector2){
    let displacement = target.clone().subtract(this.actor.getPosition().toVector2());
    this.targetPosition = target;
    this.longTermTargetPosition = target;
    if(displacement.length() > 1){
      this.targetPosition = this.actor.getPosition().toVector2().add(displacement.normalize());
      this.spriteActorVars.yVelocity = .5;
    }else{
      this.spriteActorVars.yVelocity = .5 * displacement.length();
    }
    this.spriteActor.setEulerZ((Math.random()-.5) * Math.PI / 10);
  }
  
  wait(n:number){
    this.waitframes += n;
  }
}
Sup.registerBehavior(HumanMovementBehavior);
