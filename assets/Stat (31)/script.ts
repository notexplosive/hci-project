class StatBehavior extends Sup.Behavior {
  awake() {
    if(this.displayStats){
      this.healthIndicator = new Sup.Actor('Health Indicator',this.actor);
      this.energyIndicator = new Sup.Actor('Energy Indicactor',this.actor);
    
      new Sup.TextRenderer(this.healthIndicator,'0','Font').setOpacity(1);
      
      new Sup.TextRenderer(this.energyIndicator,'0','Font').setOpacity(1);

      this.healthIndicator.moveLocal(-1,2.5,4);
      this.energyIndicator.moveLocal(1,2.5,4);
      
      if(this.templateName != ''){
        this.applyTemplate(this.templateName);
      }
    }
  }

  update() {
    // TODO: adjust these when human acquires gear
    let maxHealth = this.vigor * 10 + 5;
    // TODO: Implement health regen
    let healthRegenCooldown = 60 - this.vigor * 5;
    let maxEnergy = this.grit * 10;
    let damage = Math.floor(this.grit * 1.5 + 1);
    let maxTime = 15;
    this.clampBounds(maxHealth,maxEnergy,maxTime);
    
    if(this.displayStats){
      this.healthIndicator.textRenderer.setText(this.health);
      this.energyIndicator.textRenderer.setText(this.energy);
    }
    
    if(this.hurtTimer > 0){
      this.hurtTimer--;
      let c = 1 + Math.random();
      this.actor.spriteRenderer.setColor(c,c,c);
    }else{
      this.actor.spriteRenderer.setColor(1,1,1)
    }
    
    if(this.alive){
      //this.actor.setVisible(true);
      if(this.opponent){
        if((this.opponent.getBehavior(StatBehavior) && !this.opponent.getBehavior(StatBehavior).getAlive()) || (this.opponent != null && this.opponent.isDestroyed())){
          this.disengage();
        }
      }

      // Tick up combat timer
      if(this.opponent){
        this.time += this.speed/10;
        let diffx = this.actor.getPosition().subtract(this.opponent.getPosition()).x;
        this.actor.spriteRenderer.setHorizontalFlip(diffx < 0);
        let opStat:StatBehavior = this.opponent.getBehavior(StatBehavior);
        
        if(this.time > maxTime){
          this.time = 0;
          opStat.hurt(damage);
          if(opStat.getHealth() <= 0 ){
            this.opponent = null;
          }
        }
      }
    }else{
      //this.actor.setVisible(false);
      let b = this.actor.getBehavior(HumanMovementBehavior);
      if(b){
        b.die();
      }
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
      this.disengage();
      this.alive = false;
    }
    this.hurtTimer = 10;
    this.actor.getBehavior(HumanMovementBehavior).jump(0.5);
  }
  
  heal(n:number){
    if(this.alive){
      this.health += n;
    }
  }
  
  revive(){
    this.health = 10;
    this.alive = true;
  }
  
  getHealth(){
    return this.health;
  }
  
  resetTimer(){
    this.time = 0;
  }
  
  // Combat has started!
  engage(target:Sup.Actor){
    if(this.opponent){return}
    Sup.log(this.actor.getName()+' engaged')
    this.opponent = target;
    if(this.opponent.getBehavior(StatBehavior)){
      this.opponent.getBehavior(StatBehavior).addAttacker(this.actor);
    }
  }
  
  // Someone else engaged with you
  addAttacker(actor:Sup.Actor){
    for(let a of this.attackers){
      if(a == actor){
        return;
      }
    }
    this.attackers.push(actor);
  }
  
  // Someone else disengaged with you
  removeAttacker(actor:Sup.Actor){
    let length = this.attackers.length;
    let deletedAttacker = false;
    for(let i = 0; i < length; i++){
      if(this.attackers[i] == actor){
        this.attackers[i] = null;
        deletedAttacker = true;
      }
      if(deletedAttacker){
        this.attackers[i] = this.attackers[i+1];
      }
    }
    if(this.attackers[this.attackers.length] == undefined){
      this.attackers.pop();
    }
  }
  
  hasAttackers(){
    return this.attackers.length > 0;  
  }
  
  getAttackers(){
    return this.attackers;
  }
  
  // Combat has ended!
  disengage(){
    Sup.log(this.actor.getName()+' disengaged')
    if(this.opponent){
      let oppStat = this.opponent.getBehavior(StatBehavior);
      if(oppStat){
        oppStat.removeAttacker(this.actor);
        this.opponent = null;
      }
    }
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
  
  addSpeed(n:number){
    this.speed += n;
  }
  
  enableDisplayStats(){
    this.displayStats = true;
    this.awake();
  }
  
  getTime(){
    return this.time;
  }
  
  applyTemplate(name:string){
    let path = "Graphics/"+this.templateName;
    Sup.log(path)
    this.actor.spriteRenderer.setSprite(path);
    this.templateName = name;
    this.vigor = EnemyTemplates[this.templateName].vigor;
    this.speed = EnemyTemplates[this.templateName].speed;
    this.grit = EnemyTemplates[this.templateName].grit;
  }
  
  public templateName = '';
  
  private opponent:Sup.Actor = null;
  private alive = true;
  private attackers:Sup.Actor[] = [];
  private hurtTimer = 0;
  
  private vigor = 10;
  private grit = 10;
  private speed = 1;
  private health = 1000;
  private energy = 1000;
  private time = 0;
  private healthIndicator:Sup.Actor = null;
  private energyIndicator:Sup.Actor = null;
  private displayStats = false;
}
Sup.registerBehavior(StatBehavior);
