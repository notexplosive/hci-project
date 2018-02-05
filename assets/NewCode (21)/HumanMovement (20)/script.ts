class HumanMovementBehavior extends Sup.Behavior {
  private targetPosition:Sup.Math.Vector2 = new Sup.Math.Vector2(0,0);
  private longTermTargetPosition:Sup.Math.Vector2 = new Sup.Math.Vector2(0,0);
  private waitframes:number = 0;
  private spriteActor:Sup.Actor = null;
  private spriteActorVars = {
    yVelocity:0,
    yPosition:0
  };
  
  awake() {
    this.spriteActor = new Sup.Actor("HumanSprite",this.actor);
    new Sup.SpriteRenderer(this.spriteActor,"Graphics/Hero");
    this.spriteActor.setLocalScale(2,2,1);
    new Sup.SpriteRenderer(this.actor,'Graphics/Shadow');
  }

  update() {

    
    // ---------------------------------------- WAITFRAME BOUNDARY ------------------------------------
    // Wait out the waitframes
    if(this.waitframes > 0){
      this.waitframes--;
      return;
    }
    
    // Handle sprite graphic
    this.spriteActorVars.yPosition += this.spriteActorVars.yVelocity;
    this.spriteActorVars.yVelocity -= .03;
    if(this.spriteActorVars.yPosition < 0){
      this.spriteActorVars.yPosition = 0;
      this.spriteActorVars.yVelocity = 0;
      this.spriteActor.setEulerZ(0);
    }
    
    // Applies the yPosition field and deals with ZOrdering
    let foreground = -this.actor.getPosition().y*.01;
    this.spriteActor.setLocalPosition(0,this.spriteActorVars.yPosition*.1 + 1,foreground );
    this.spriteActor.setLocalScale(2 + foreground,2 + foreground,1)
    
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
      // Note! we need to only allow new movement commands if yPosition is at zero, like so
      if(this.spriteActorVars.yPosition == 0){
        this.setTargetPosition(new Sup.Math.Vector2(Math.random()-.5,Math.random()-.5).multiplyScalar(5));
        this.wait(5);
      }
    }
  }
  
  setTargetPosition(target:Sup.Math.Vector2){
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



// Test HumanMovement
for(let i = 0; i < 10; i++){
  new Sup.Actor("Human").addBehavior(HumanMovementBehavior);
}
new Sup.Actor("Game").addBehavior(GameBehavior);