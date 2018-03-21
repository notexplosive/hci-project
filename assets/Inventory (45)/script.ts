class InventoryBehavior extends Sup.Behavior {
  awake() {
    this.initializeItemList();
  }

  update() {
    if(Sup.Input.wasKeyJustPressed('I') /*TODO: Menu button to open the inventory*/){
      INVENTORY_OPEN = !INVENTORY_OPEN;
    }
    
    this.actor.setVisible(INVENTORY_OPEN);
    // Mouseover handling
    // TODO: add touch screen support
    if(INVENTORY_OPEN){
      let none = true;
      let realMousePos = getRealMousePosition();
      for(let itemRoot of this.actor.getChildren()){
        if(itemRoot.getName() != "InventoryTitle" && itemRoot.getName() != "InventoryTooltip"){
          let diffx = Math.abs(itemRoot.getPosition().x - realMousePos.x)
          let diffy = Math.abs(itemRoot.getPosition().y - realMousePos.y)

          if(diffx < .75 && diffy < .25){
            none = false;
            let c = 1.1;
            Sup.getActor("InventoryTooltip").textRenderer.setText(itemRoot.getName());
            itemRoot.spriteRenderer.setColor(1.2,1.2,1.2);
            itemRoot.textRenderer.setColor(0.5,1,0.5);
            if(Sup.Input.wasMouseButtonJustPressed(0)){
              UseItem(itemRoot.getName(),HUMAN);
              this.initializeItemList();
            }
          }else{
            itemRoot.spriteRenderer.setColor(1,1,1);
            itemRoot.textRenderer.setColor(0,0,0);
          }
        }
      }
      
      if(none){
        Sup.getActor("InventoryTooltip").textRenderer.setText("");
      }
    }
  }
  
  // Render all of the actors and quantities for all of the items
  initializeItemList(){
    for(let itemRoot of this.actor.getChildren()){
      if(itemRoot.getName() != "InventoryTitle" && itemRoot.getName() != "InventoryTooltip"){
        itemRoot.destroy();
      }
    }
    
    let itemCount = 0;
    for(let item of ITEM_LIST){
      let name = item.itemName;
      let itemRoot = new Sup.Actor(name,this.actor);
      let itemImage = new Sup.Actor("ItemImage"+name,itemRoot);
      let itemText = new Sup.Actor("ItemText"+name,itemRoot);
      itemText.moveLocalX(0.5);
      itemImage.moveLocalX(-0.5);
      itemRoot.moveY(2 - itemCount/2 - itemCount*.2);
      itemCount++;

      let tx = new Sup.TextRenderer(itemText,"x"+item.quantity,"Font");
      tx.setOpacity(1);
      let sp = new Sup.SpriteRenderer(itemImage,"Graphics/"+ItemTemplates[name].imagePath)
      sp.setAnimation("All");
      sp.setAnimationFrameTime(ItemTemplates[name].imageFrame);
      sp.pauseAnimation();
      itemRoot.spriteRenderer = sp;
      itemRoot.textRenderer = itemText.textRenderer;
    }
  }
}
Sup.registerBehavior(InventoryBehavior);
