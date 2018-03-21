class LootBehavior extends Sup.Behavior {
  awake() {
    
  }
  
  start() {
    Sup.log("spawned a " + this.itemName);
  }

  update() {
    
  }
  
  
  itemName:string = '';
}
Sup.registerBehavior(LootBehavior);
