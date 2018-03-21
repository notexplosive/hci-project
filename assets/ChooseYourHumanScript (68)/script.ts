class ChooseYourHumanBehavior extends Sup.Behavior {
  awake() {
    for(let i = 0; i < 8; i++){
      let act = new Sup.Actor("Human",this.actor);
      act.setLocalScale(2,2,1);
      let s = new Sup.SpriteRenderer(act).setSprite("Graphics/Human");
      s.setAnimation("All");
      s.pauseAnimation();
      s.setAnimationFrameTime(i);
      
      act.setPosition((i-7/2)*1.5,0,0);
    }
  }

  update() {
    let humans = this.actor.getChildren();
    let i = 0;
    for(let human of humans){
      if(human.getPosition().toVector2().distanceTo(getRealMousePosition()) < .5){
        human.spriteRenderer.setColor(1.2,1.2,1.2);
        if(Sup.Input.wasMouseButtonJustPressed(0)){
          HUMAN_CHOICE = i;
          Sup.loadScene("HomeScene");
        }
      }else{
        human.spriteRenderer.setColor(1,1,1);
      }
      i++;
    }
  }
}
Sup.registerBehavior(ChooseYourHumanBehavior);
