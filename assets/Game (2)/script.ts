class GameBehavior extends Sup.Behavior {
  awake() {
    HOME_MODE = false;
  }
  
  update() {
    let mp = getRealMousePosition();
    let tp = Sup.Input.getTouchPosition(0);
    
    this.clickOrTouchLocation = null;
    
    if(Sup.Input.wasMouseButtonJustPressed(0) || Sup.Input.wasTouchStarted(0)){
      if(!Sup.Input.wasMouseButtonJustPressed(0)){
        mp = tp;
      }
      
      this.clickOrTouchLocation = mp;
      
      if(!SCROLL_MODE){
        //Sup.getActor("Human").getBehavior(HumanMovementBehavior).moveTowards(new Sup.Math.Vector2(mp.x,mp.y));
      }
    }
    
    if(MAP.choseNewTile()){
      this.travelTimer = 60*3;
      SCROLL_MODE = true;
    }else if(this.allEnemiesCleared() && !SCROLL_MODE && this.travelTimer == -1){
      MAP.promptForNextMove();
    }
    
    if(this.travelTimer > 0){
      this.travelTimer--;
    }
    if(this.travelTimer == 0){
      this.travelTimer = -1;
      SCROLL_MODE = false;
      let numberOfEnemies = Math.floor(Math.random()*3);
      for(let i = 0; i < numberOfEnemies; i++){
        this.spawnEnemy();
      }
      // Spawn enemies
    }
    
    //
    // Fun debugging hotkeys
    //
    if(Sup.Input.wasKeyJustPressed('R')){
      Sup.loadScene('Dungeon');
    }
    
    if(Sup.Input.wasKeyJustPressed('K')){
      SCROLL_MODE = !SCROLL_MODE;
    }
    
    if(Sup.Input.wasKeyJustPressed('J')){
      this.spawnEnemy();
    }
  }
  
  spawnEnemy(){
    let enemy = new Sup.Actor("Enemy");
    enemy.setPosition(7,-Math.random()*2,0)
    enemy.addBehavior(EnemyBehavior);
    enemy.getBehavior(StatBehavior).applyTemplate('Skeleton')
  }
  
  allEnemiesCleared(){
    return ENEMIES.length == 0;
  }
  
  getClickOrTouchLocation(){
    if(this.clickOrTouchLocation){
      return this.clickOrTouchLocation.clone();
    }else{
      return null;
    }
  }
  
  private travelTimer = 0;
  private clickOrTouchLocation:Sup.Math.Vector2;
}
Sup.registerBehavior(GameBehavior);