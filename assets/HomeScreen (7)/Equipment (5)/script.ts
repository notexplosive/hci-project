class EquipmentBehavior extends Sup.Behavior {

  update() {
    // TODO (wyatt): This is supler inflexible, there are two places where we calculate this length
    // Ideally the object should remove its location from the hero's points of interest list.
    // Also we should not use Sup.getActor() and search by name. This is bad for all sorts of reasons.
    let hero = Sup.getActor("Hero");
    if(hero.getPosition().subtract(this.actor.getPosition()).length() < 1){
      hero.getBehavior(HeroClothingBehavior).equip(this.slot,this.index);
      this.actor.destroy();
    }
  }
  
  slot:string = "";
  index:number = 0;
}
Sup.registerBehavior(EquipmentBehavior);
