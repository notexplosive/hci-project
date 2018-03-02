class StatBehavior extends Sup.Behavior {
  awake() {
    this.healthIndicator = new Sup.Actor('Health Indicator',this.actor);
    this.energyIndicator = new Sup.Actor('Energy Indicactor',this.actor);
    this.timeIndicator = new Sup.Actor('Time Indicator',this.actor);
    
    new Sup.TextRenderer(this.healthIndicator,'0','Font').setOpacity(1);
    new Sup.TextRenderer(this.timeIndicator,'0','Font').setOpacity(1);
    new Sup.TextRenderer(this.energyIndicator,'0','Font').setOpacity(1);
    
    this.healthIndicator.moveLocal(-1,2,4);
    this.energyIndicator.moveLocal(1,2,4);
    this.timeIndicator.moveLocal(0,2,4);
  }

  update() {
    this.healthIndicator.textRenderer.setText(this.health);
    this.energyIndicator.textRenderer.setText(this.energy);
    this.timeIndicator.textRenderer.setText(Math.floor(this.time));
    
    // TODO: adjust these when human acquires gear
    let maxHealth = this.vigor * 10 + 5;
    // TODO: Implement health regen
    let healthRegenCooldown = 60 - this.vigor * 5;
    let maxEnergy = this.grit * 10;
    let damage = Math.floor(this.grit * 1.5 + 1);
    let maxTime = 15;
    this.clampBounds(maxHealth,maxEnergy,maxTime);
    
    if(this.opponent && !this.opponent.getBehavior(StatBehavior).getAlive()){
      this.opponent = null;
    }
    
    // Tick up combat timer
    if(this.opponent){
      this.time += this.speed/10;
      
      if(this.time > maxTime){
        this.time = 0;
        let opStat = this.opponent.getBehavior(StatBehavior);
        opStat.hurt(damage);
        if(opStat.getHealth() <=0 ){
          this.opponent = null;
        }
      }
    }
    
    if(this.alive){
      //this.actor.setVisible(true);
    }else{
      //this.actor.setVisible(false);
      this.actor.getBehavior(HumanMovementBehavior).die()
    }
  }
  
  getAlive():boolean{
    return this.alive;
  }
  
  hurt(n:number){
    // todo: render text that shows a '-n' every time you get hit
    // should also support '+n' in green when they get healed.
    this.health -= n;
    if(this.health <= 0){
      this.alive = false;
    }
  }
  
  getHealth(){
    return this.health;
  }
  
  resetTimer(){
    this.time = 0;
  }
  
  // Combat has started!
  engage(target:Sup.Actor){
    this.opponent = target;
  }
  
  // Combat has ended!
  disengage(){
    this.opponent = null;
  }
  
  // Clerical checks to make sure nothing goes above its max.
  clampBounds(maxHealth,maxEnergy,maxTime){
    if(this.health > maxHealth){
      this.health = maxHealth;
    }
    
    if(this.energy > maxEnergy){
      this.energy = maxEnergy;
    }
    
    if(this.time > maxTime){
      this.time = maxTime;
    }
  }
  
  private opponent:Sup.Actor = null;
  private alive = true;
  
  private vigor = 1;
  private grit = 1;
  private speed = 1;
  private health = 10;
  private energy = 10;
  private time = 0;
  private healthIndicator:Sup.Actor = null;
  private energyIndicator:Sup.Actor = null;
  private timeIndicator:Sup.Actor = null;
}
Sup.registerBehavior(StatBehavior);
