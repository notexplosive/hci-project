class HumanBehavior extends Sup.Behavior {
  awake() {
    HUMAN = this.actor;
    this.actor.addBehavior(HumanMovementBehavior);
    
    this.actor.getBehavior(StatBehavior).addSpeed(2);
    this.actor.getBehavior(StatBehavior).enableDisplayStats();
    this.actor.getBehavior(HumanMovementBehavior).moveTowards(new Sup.Math.Vector2(0,0))
    
    this.actor.spriteRenderer.setAnimationFrameTime(HUMAN_CHOICE);
    
    new Sup.Actor('HumanTimeIndicator').addBehavior(TimeIndicatorBehavior).stat = this.actor.getBehavior(StatBehavior);
    let eti = new Sup.Actor('EnemyTimeIndicator').addBehavior(TimeIndicatorBehavior)
    eti.rotationDirection = -eti.rotationDirection;
    eti.currentRotZ = -eti.currentRotZ;
    eti.awake();
  }

  update() {
    let stats = this.actor.getBehavior(StatBehavior);
    if(SCROLL_MODE){
      this.actor.getBehavior(HumanMovementBehavior).moveTowards(new Sup.Math.Vector2(Math.random()-.5,Math.random()-.5).multiplyScalar(3));
      this.actor.spriteRenderer.setHorizontalFlip(true);
    }
    
    // Sup.log(stats.getAttackers());
    if(this.currentTarget && this.currentTarget.isDestroyed()){this.currentTarget = null}
    if(this.currentTarget && !this.currentTarget.getBehavior(StatBehavior).getAlive()){this.currentTarget = null;}
    
    if(stats.hasAttackers()){
      let attackers = stats.getAttackers();
      if(!this.currentTarget){
        if(attackers.length > 0){
          let index = Math.floor(Math.random()*attackers.length);
          this.currentTarget = attackers[index]
        }
      }else{
        if(this.currentTarget){
          Sup.getActor('EnemyTimeIndicator').getBehavior(TimeIndicatorBehavior).stat = this.currentTarget.getBehavior(StatBehavior);
          stats.engage(this.currentTarget);
        }
      }
    }
    if(this.currentTarget == null){
      Sup.getActor('EnemyTimeIndicator').getBehavior(TimeIndicatorBehavior).stat = null;
    }
  }
  
  currentTarget:Sup.Actor = null;
}
Sup.registerBehavior(HumanBehavior);
