class EnemyBehavior extends Sup.Behavior {
  awake() {
    this.movement = this.actor.addBehavior(HumanMovementBehavior);
    this.stat = this.actor.getBehavior(StatBehavior);
  }

  update() {
    let displacement = getDisplacement(HUMAN.getPosition().toVector2(),this.actor.getPosition().toVector2());
    let distance = displacement.length();
    
    if(!HUMAN.getBehavior(StatBehavior).getAlive()){
      distance = 100;
      if(this.aggro){
        this.aggro = false;
        this.waitTick = 10 + Math.random()*20;
      }
    }
    
    if(this.aggro){
      this.actor.spriteRenderer.setColor(1,.8,.8);
      if(this.combatPosition == null){
        this.combatPosition = displacement.clone().normalize().multiplyScalar(-MELEE_RANGE);
        this.movement.moveTowards(HUMAN.getPosition().toVector2().add(this.combatPosition));
      }

      let inCombat = distance < MELEE_RANGE*1.1
      if(inCombat){
        this.stat.engage(HUMAN);
      }else{
        this.combatPosition = null;
        this.stat.disengage();
      }
    }
    
    if(this.waitTick > 0){
      this.waitTick--;
    }else{
      if(!this.aggro){
        this.actor.spriteRenderer.setColor(1,1,1);
        this.waitTick = 120 + 30 * Math.random();
        this.movement.moveTowards(new Sup.Math.Vector2(Math.random()-.5,Math.random()-.5).multiplyScalar(4));
        this.stat.resetTimer();
        
        this.aggro = distance < 4;
      }
    }
  }
  
  private waitTick = 0;
  private movement:HumanMovementBehavior = null;
  private stat:StatBehavior = null;
  private aggro = false;
  // Gets assigned to a location witihn MELEE_DISTANCE of the Human.
  private combatPosition: Sup.Math.Vector2 = null;
}
Sup.registerBehavior(EnemyBehavior);
