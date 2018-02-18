class HeroWanderBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {    
    this.timer ++;
    
    if(this.timer % 60 === 0){
      if(this.pointsOfInterest.length === 0){
        if(probability(75)){
          this.direction = new Sup.Math.Vector2(Math.random()-.5,Math.random()-.5).normalize();
        }else{
          this.direction = new Sup.Math.Vector2(0,0);
        }
      }else{
        if(this.currentPointOfInterest === -1){
          let rand = randomElementFrom(this.pointsOfInterest)
          this.currentPointOfInterest = rand[1];
        }
        let index = this.currentPointOfInterest;
        let target = this.pointsOfInterest[this.currentPointOfInterest];
        let displacement = target.subtract(this.actor.getPosition().toVector2());
        this.direction = displacement.normalize();
        
        if(displacement.length() < 1){
          this.pointsOfInterest.slice(index);
          this.currentPointOfInterest = -1;
          this.direction = new Sup.Math.Vector2(0,0);
        }
      }
    }
    
    if(this.actor.getPosition().x > 5){
      this.direction.x = -1;
    }
    if(this.actor.getPosition().x < -5){
      this.direction.x = 1;
    }
    if(this.actor.getPosition().y > 3){
      this.direction.y = -1;
    }
    if(this.actor.getPosition().y < -3){
      this.direction.y = 1;
    }
    
    this.actor.move(this.direction.clone().multiplyScalar(.01));
  }
  
  pushPointOfInterest(v:Sup.Math.Vector2){
    this.pointsOfInterest.unshift(v);
  }
  
  private timer:number = 0;
  private direction:Sup.Math.Vector2 = new Sup.Math.Vector2(0,0);
  private pointsOfInterest:Sup.Math.Vector2[] = [];
  private currentPointOfInterest:number = -1;
}
Sup.registerBehavior(HeroWanderBehavior);
