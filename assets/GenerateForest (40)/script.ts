class GenerateForestBehavior extends Sup.Behavior {
  awake() {
    for(let i = 0; i < 5; i++){
      let tree = new Sup.Actor('Tree');
      tree.addBehavior(ScrollObjectBehavior);
      tree.spriteRenderer.setSprite("Graphics/Tree");
      tree.setPosition((Math.random()-.5)*20,Math.random() * 3);
    }
  }

  update() {
    
  }
}
Sup.registerBehavior(GenerateForestBehavior);
