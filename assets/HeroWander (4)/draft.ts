class HeroWanderBehavior extends Sup.Behavior {
  awake() {
    
  }

  update() {    
    this.timer ++;
    
    if(this.timer % 60 === 0){
      if(this.pointsOfInterest.length === 0 || probability(10)){
        if(probability(75)){
          this.direction = new Sup.Math.Vector2(Math.random()-.5,Math.random()-.5).normalize();
        }else{
          //this.direction = new Sup.Math.Vector2(0,0);
        }
      }else{
        let rand = randomElementFrom(this.pointsOfInterest)
        let target = rand[0].clone();
        let index = rand[1];
        let displacement = target.subtract(this.actor.getPosition().toVector2());
        this.direction = displacement.normalize();
        
        if(displacement.length() < 1){
          
          this.pointsOfInterest.slice(index);
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
    this.pointsOfInterest.push(v);
  }
  
  private timer:number = 0;
  private direction:Sup.Math.Vector2 = new Sup.Math.Vector2(0,0);
  private pointsOfInterest:Sup.Math.Vector2[] = [];
}
Sup.registerBehavior(HeroWanderBehavior);
