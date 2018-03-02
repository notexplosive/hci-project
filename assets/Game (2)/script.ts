class GameBehavior extends Sup.Behavior {
  awake() {
    
  }
  
  update() {
    let mp = getRealMousePosition();
    let tp = Sup.Input.getTouchPosition(0);
    
    if(Sup.Input.wasMouseButtonJustPressed(0) || Sup.Input.wasTouchStarted(0)){
      if(!Sup.Input.wasMouseButtonJustPressed(0)){
        mp = tp;
      }
      
      if(!SCROLL_MODE){
        Sup.getActor("Human").getBehavior(HumanMovementBehavior).moveTowards(new Sup.Math.Vector2(mp.x,mp.y));
      }
    }
    
    if(MAP.choseNewTile()){
      this.travelTimer = 120;
      SCROLL_MODE = true;
    }else if(this.allEnemiesCleared() && !SCROLL_MODE && this.travelTimer == 0){
      MAP.promptForNextMove();
    }
    
    if(this.travelTimer > 0){
      this.travelTimer--;
      Sup.log(this.travelTimer);
    }else{
      SCROLL_MODE = false;
      // Spawn enemies
    }
    
    //
    // Fun debugging hotkeys
    //
    if(Sup.Input.wasKeyJustPressed('K')){
      SCROLL_MODE = !SCROLL_MODE;
    }
    
    if(Sup.Input.wasKeyJustPressed('J')){
      let enemy = new Sup.Actor("Enemy");
      enemy.setPosition(8,0,0)
      enemy.addBehavior(EnemyBehavior);
    }
  }
  
  allEnemiesCleared(){
    return true;
  }
  
  private travelTimer = 0;
}
Sup.registerBehavior(GameBehavior);