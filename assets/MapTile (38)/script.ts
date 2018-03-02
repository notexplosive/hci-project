class MapTileBehavior extends Sup.Behavior {
  awake(){
    new Sup.SpriteRenderer(this.actor,"Graphics/MapTiles");
  }
  
  init(x:number,y:number,cellType:CellType){
    this.setRevealedAnim(cellType);
    this.actor.setLocalPosition(x,y)
  }

  update() {
    if(this.explored){
      this.actor.spriteRenderer.setAnimation(this.revealedAnim)
      this.actor.setEulerZ(this.revealedAngle);
    }
    
    if(this.inProgress){
      this.tick += 1;
      let c = Math.abs(Math.sin(this.tick*Math.PI/60))
      this.actor.spriteRenderer.setColor(c+1,c+1,c+1)
    }else{
      this.actor.spriteRenderer.setColor(1,1,1)
    }
  }
  
  setRevealedAnim(cellType:CellType){
    let anim;
    
    // Set animation. Most of the tiles are the same just rotated.
    switch(cellType){
      case(CellType.NWES): 
        anim = "NWES"
      break;
      case(CellType.WE): 
      case(CellType.NS):
        anim = "WE"
      break;
      case(CellType.NE): 
      case(CellType.ES): 
      case(CellType.NW):
      case(CellType.WS):
        anim = "ES"
      break;
      case(CellType.N):
      case(CellType.E):
      case(CellType.S):
      case(CellType.W):
        anim = "E"
      break;
      case(CellType.NWE):
      case(CellType.NSE):
      case(CellType.NSW):
      case(CellType.SWE):
        anim = "NWE"
      break;
      case(CellType.Empty):
        anim = "Unexplored"
    }
    
    // (second pass) Set rotation
    // Doesn't bother with WE, ES, W, NWE or NESW because they don't need rotation
    // 1 = 90 degrees COUNTER CLOCKWISE, 2 = 180 degrees, etc
    let angle = 0;
    switch(cellType){ 
      // 3 way forks
      case(CellType.NSW): angle = 1;  break;
      case(CellType.SWE): angle = 2;  break;
      case(CellType.NSE): angle = 3;  break;
      // Corners
      case(CellType.NE): angle = 1;   break;
      case(CellType.NW): angle = 2;   break;
      case(CellType.WS): angle = 3;   break;
      // Hallways
      case(CellType.NS):  angle = 1;  break;
      // Dead Ends
      case(CellType.N):   angle = 1;  break;
      case(CellType.W):   angle = 2;  break;
      case(CellType.S):   angle = 3;  break;
    }
    
    this.revealedAnim = anim;
    this.revealedAngle = angle*Math.PI/2;
    this.cellType = cellType;
  }
  
  discover(){
    this.explored = true;
    this.inProgress = true;
  }
  
  wasExplored(){
    return this.explored;
  }
  
  finish(){
    this.inProgress = false;
  }
  
  complete(){
    this.inProgress = false;
    let data = []//{north:false,south:false,east:false,west:false};
    if(this.cellType & CellType.E){
      data.push("east")
    }
    if(this.cellType & CellType.S){
      data.push('south')
    } 
    if(this.cellType & CellType.W){
      data.push('west')
    }
    if(this.cellType & CellType.N){
      data.push('north')
    }
    return data;
  }
  
  private explored = false;
  private revealedAnim = "NWES";
  private revealedAngle = 0;
  private cellType:CellType;
  private inProgress = false;
  
  private tick = 0;
}
Sup.registerBehavior(MapTileBehavior);