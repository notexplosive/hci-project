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
  private dead = false;
  private angle = 0;
  private no_walk_zone_y = 0;
  
  awake() {
    this.spriteActor = new Sup.Actor("HumanSprite",this.actor);
    this.spriteActor.addBehavior(ZOrderBehavior).getPosFrom = this.actor;
    new Sup.SpriteRenderer(this.spriteActor,"Graphics/Human").setAnimation("All");
    
    // This is weird. I would never advise doing this normally.
    // Ordinarily spriteRenderer gets defined when you call `new SpriteRenderer(this.actor)`
    this.actor.spriteRenderer = this.spriteActor.spriteRenderer;
    this.actor.spriteRenderer.pauseAnimation();
    
    this.actor.addBehavior(StatBehavior);
    
    this.moveTowards(this.actor.getPosition().toVector2());
  }

  update() {
    // TODO: We can handle collision by disallowing certain target positions? Re-clamping them to the nearest allowed location?
    // This would have to apply to even intermediary target positions, not just long term.
    
    if(this.dead){
      if(this.angle >= -Math.PI/2){
        this.angle -= Math.PI/30;
      }
      this.actor.setEulerZ(this.angle);
      
      return;
    }
    
    if(this.actor.getPosition().y > this.no_walk_zone_y){
      this.actor.moveY(-.1);
    }
    
    // ---------------------------------------- DEAD BOUNDARY ----------------------------------------
    // Nothing past this line will be executed if dead == true
    
    // ---------------------------------------- WAITFRAME BOUNDARY ------------------------------------
    // Wait out the waitframes nothing past this line will be executed if we have enqued any waitframes
    
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
      if(!SCROLL_MODE){
        this.actor.spriteRenderer.setHorizontalFlip(displacement.x > 0);
      }
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
  
  isMoving(){
    return this.spriteActorVars.yPosition > 0
  }
  
  // Internal method for movement
  private setTargetPosition(target:Sup.Math.Vector2){
    if(target.y > this.no_walk_zone_y){
      target.y = this.no_walk_zone_y;
    }
    let displacement = target.clone().subtract(this.actor.getPosition().toVector2());
    this.targetPosition = target;
    this.longTermTargetPosition = target;
    if(displacement.length() > 1){
      this.targetPosition = this.actor.getPosition().toVector2().add(displacement.normalize());
      this.spriteActorVars.yVelocity = .5;
    }else{
      this.spriteActorVars.yVelocity = .5 * displacement.length();
    }
  }
  
  wait(n:number){
    this.waitframes += n;
  }
  
  die(){
    if(!this.dead){
      this.actor.addBehavior(ScrollObjectBehavior);
    }
    this.dead = true;
  }
  
  jump(n:number){
    this.spriteActorVars.yVelocity = n;
  }
}
Sup.registerBehavior(HumanMovementBehavior);
