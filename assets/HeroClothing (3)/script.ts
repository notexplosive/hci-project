class HeroClothingBehavior extends Sup.Behavior {
  equip(slot:string,imageIndex:number){
    // If that slot is undefined, we error out.
    if(this.clothes[slot] !== undefined){
      if(this.clothes[slot] === 0){
        // Zero means no item is currently in that slot.
        let clothingPiece = new Sup.Actor(slot,this.actor);
        clothingPiece.setLocalPosition(0,0,.1);
        new Sup.SpriteRenderer(clothingPiece,"SampleHero");
        clothingPiece.spriteRenderer.setAnimation("All");
        clothingPiece.spriteRenderer.setAnimationFrameTime(imageIndex);
        clothingPiece.spriteRenderer.pauseAnimation();
      }else{
        let children = this.actor.getChildren();
        let clothingPiece:Sup.Actor;
        for(let child of children){
          if(child.getName() === slot){
            clothingPiece = child;
          }
        }
        clothingPiece.spriteRenderer.setAnimationFrameTime(imageIndex);
      }
      this.clothes[slot] = imageIndex;
    }else{
      Sup.log("There's no item slot called \""+ slot + "\"");
    }
    
  }
  
  private clothes:{
    shirt:number,
    hat:number,
    sword:number,
    pants:number,
    shield:number
  } = {shirt:0,hat:0,sword:0,pants:0,shield:0}
}
Sup.registerBehavior(HeroClothingBehavior);
