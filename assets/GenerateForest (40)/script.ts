class GenerateForestBehavior extends Sup.Behavior {
  awake() {
    // Background
    for(let i = 0; i < 5; i++){
      let tree = new Sup.Actor('Tree');
      tree.addBehavior(ScrollObjectBehavior);
      tree.spriteRenderer.setSprite("Graphics/Tree");
      tree.spriteRenderer.setHorizontalFlip(Math.random() > .5);
      tree.setPosition((i/5)*30,1 + Math.random() * 2 );
    }
    
    // Foreground
    for(let i = 0; i < 2; i++){
      let tree = new Sup.Actor('Tree');
      tree.addBehavior(ScrollObjectBehavior);
      tree.spriteRenderer.setSprite("Graphics/Tree");
      tree.spriteRenderer.setHorizontalFlip(Math.random() > .5);
      tree.setPosition((i/2)*30,-1 - Math.random() * 2 );
      tree.spriteRenderer.setOpacity(.25);
    }
  }

  update() {
    
  }
}
Sup.registerBehavior(GenerateForestBehavior);
