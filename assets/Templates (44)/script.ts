class EnemyTemplate{
  vigor:number;
  speed:number;
  grit:number;
  
  constructor(vigor,grit,speed){
    this.vigor = vigor;
    this.speed = speed;
    this.grit = grit;
  }
}

class ItemTemplate{
  imagePath:string = "Items";
  imageFrame:number = 0;
  name:string;
  effect:string;
  
  // Effect is a callback function
  constructor(name:string,frame:number=0,effect,path:string="Items"){
    if(!ItemTemplates[name]){
      ItemTemplates[name] = this;
      this.name = name;
      this.effect = effect;
      this.imagePath = path;
      this.imageFrame = frame;
    }else{
      Sup.log("ERR: attempt to create multiple templates for item " + name);
    }
  }
}

function AddItemToInventory(templateName:string){
  let template = ItemTemplates[templateName];
  let alreadyHasItem = false;
  for(let item of ITEM_LIST){
    if(item.itemName == template.name){
      item.quantity++;
      alreadyHasItem = true;
      break;
    }
  }
  
  if(!alreadyHasItem){
    ITEM_LIST.push({itemName:template.name,quantity:1});
  }
}

function UseItem(itemName,target:Sup.Actor){
  Sup.log(itemName + " used!")
  let flagForDelete = null;
  for(let item of ITEM_LIST){
    if(item.itemName == itemName){
      item.quantity--;
      Sup.log(item.quantity);
      if(item.quantity == 0){
        flagForDelete = item.itemName;
      }
      break;
    }
  }
  
  if(flagForDelete){
    // Now we remove the empty item from the list
    let pushBack = false;
    for(let i = 0; i < ITEM_LIST.length; i++){
      if(flagForDelete == ITEM_LIST[i].itemName){
        pushBack = true;
      }
      if(pushBack){
        ITEM_LIST[i] = ITEM_LIST[i+1];
      }
    }
    ITEM_LIST.pop();
  }
  
  // Call the callback
  ItemTemplates[itemName].effect(target);
}

let EnemyTemplates = {}
EnemyTemplates['Skeleton'] = new EnemyTemplate(6,8,1);
EnemyTemplates['Green Slime'] = new EnemyTemplate(3,3,2);
EnemyTemplates['Blue Slime'] = new EnemyTemplate(6,6,2);

let ItemTemplates = {}
new ItemTemplate("Healing Potion",0,function(target:Sup.Actor){
  target.getBehavior(StatBehavior).heal(60);
});
new ItemTemplate("Revive Tonic",1,function(target:Sup.Actor){
  target.getBehavior(StatBehavior).revive();
});
new ItemTemplate("Slime Ball",2,function(target:Sup.Actor){
  
});

AddItemToInventory("Healing Potion");
AddItemToInventory("Healing Potion");
AddItemToInventory("Slime Ball");