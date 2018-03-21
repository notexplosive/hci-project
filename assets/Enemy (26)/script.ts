class EnemyBehavior extends Sup.Behavior {
  awake() {
    this.movement = this.actor.addBehavior(HumanMovementBehavior);
    this.stat = this.actor.getBehavior(StatBehavior);
    ENEMIES.push(this.actor);
    let monsterTypes = ['Skeleton','Green Slime','Blue Slime'];
    this.stat.templateName = monsterTypes[Math.floor(monsterTypes.length * Math.random())];
  }

  update() {
    let displacement = getDisplacement(HUMAN.getPosition().toVector2(),this.actor.getPosition().toVector2());
    let distance = displacement.length();
    
    // If HUMAN is dead
    if(!HUMAN.getBehavior(StatBehavior).getAlive()){
      distance = 100;
      if(this.aggro){
        this.aggro = false;
        this.waitTick = 10 + Math.random()*20;
      }
    }
    
    if(this.aggro && this.stat.getAlive()){
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
        this.stat.resetTimer();
      }
    }
    
    if(!this.stat.getAlive()){
      if(this.deadTimer > 0){
        this.deadTimer--;
      }else{
        this.spawnItem();
        removeEnemy(this.actor);
        this.actor.destroy();
      }
    }
    
    if(this.waitTick > 0){
      this.waitTick--;
    }else{
      if(!this.aggro){
        this.waitTick = 120 + 30 * Math.random();
        this.movement.moveTowards(new Sup.Math.Vector2(Math.random()-.5,-Math.random()).multiplyScalar(2));
        this.stat.resetTimer();
        
        this.aggro = distance < 6;
      }
    }
  }
  
  spawnItem(){
    let numberOfDrops = Math.floor(Math.random()*3);
    for(let i = 0; i < numberOfDrops; i++){
      let lootTable = EnemyTemplates[this.stat.templateName].lootTable;
      let lootName = lootTable[Math.floor(lootTable.length * Math.random())];
      let act = new Sup.Actor("Dropped"+lootName);
      act.setPosition(this.actor.getPosition());
      act.move(Math.random()-0.5,Math.random()-0.5);
      let behavior = act.addBehavior(LootBehavior);
      behavior.itemName = lootName;
    }
  }
  
  private waitTick = 0;
  private movement:HumanMovementBehavior = null;
  private stat:StatBehavior = null;
  private aggro = false;
  // Gets assigned to a location witihn MELEE_DISTANCE of the Human.
  private combatPosition: Sup.Math.Vector2 = null;
  private deadTimer = 120;
}
Sup.registerBehavior(EnemyBehavior);
