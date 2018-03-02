class MapBehavior extends Sup.Behavior {
  awake() {
    MAP = this;
    this.mapContents = [];
    let mapData:{north:boolean,west:boolean,east:boolean,south:boolean}[][] = [];
    let mapProto:boolean[][] = []
    let cells:CellType[][] = []
    for(let x = 0; x < 7; x++){
      this.mapContents[x] = []
      mapData[x] = []
      mapProto[x] = []
      cells[x] = []
      for(let y = 0; y < 5; y++){
        this.createTile(x,y,CellType.Empty);
        cells[x][y] = CellType.Empty;
        mapData[x][y] = {
          north:false,
          west:false,
          east:false,
          south:false
        }
        mapProto[x][y] = Math.random() < .8;
      }
    }
    
    let startPos = {x:0,y:Math.floor(Math.random()*5)}
    let pos = {x:startPos.x,y:startPos.y};
    
    mapProto[pos.x][pos.y] = true;
    
    let doneSearching = false
    let revisitRate = .7
    let size = 0
    let maxSize = 80
    let q = []
    while(!doneSearching && size < maxSize){
      doneSearching = true;
      if(!(mapData[pos.x][pos.y].north && mapData[pos.x][pos.y].south && mapData[pos.x][pos.y].west && mapData[pos.x][pos.y].east)){
        size++;
      }
      if(pos.x < mapProto.length-1 && mapProto[pos.x+1][pos.y]){
        q.push({x:pos.x,y:pos.y});
        mapData[pos.x][pos.y].east = true;
        mapProto[pos.x][pos.y] = Math.random() < revisitRate;
        pos.x = pos.x + 1;
        mapData[pos.x][pos.y].west = true;
        doneSearching = false;
      }else if(pos.y < mapProto[0].length-1 && mapProto[pos.x][pos.y+1]){
        q.push({x:pos.x,y:pos.y});
        mapData[pos.x][pos.y].north = true;
        mapProto[pos.x][pos.y] = Math.random() < revisitRate;
        pos.y = pos.y + 1;
        mapData[pos.x][pos.y].south = true;
        doneSearching = false;
      }else if(pos.x > 0 && mapProto[pos.x-1][pos.y]){
        q.push({x:pos.x,y:pos.y});
        mapData[pos.x][pos.y].west = true;
        mapProto[pos.x][pos.y] = Math.random() < revisitRate;
        pos.x = pos.x - 1;
        mapData[pos.x][pos.y].east = true;
        doneSearching = false;
        continue
      }else if(pos.y > 0 && mapProto[pos.x][pos.y-1]){
        q.push({x:pos.x,y:pos.y});
        mapData[pos.x][pos.y].south = true;
        mapProto[pos.x][pos.y] = Math.random() < revisitRate;
        pos.y = pos.y - 1;
        mapData[pos.x][pos.y].north = true;
        doneSearching = false;
      }else{
        pos = q.pop();
        if(pos != undefined){
          doneSearching = false
        }
      }
    }
    
    if(size < 10){
      this.awake()
      return
    }
    
    mapData[startPos.x][startPos.y].west = true;
    this.humanPosition = startPos;
    
    let turns = 0
    for(let x = 0; x < 7; x++){
      for(let y = 0; y < 5; y++){
        let bits:CellType = 0;
        if(mapData[x][y].north){
          bits |= CellType.N;
        }
        if(mapData[x][y].east){
          bits |= CellType.E;
        }
        if(mapData[x][y].south){
          bits |= CellType.S;
        }
        if(mapData[x][y].west){
          bits |= CellType.W;
        }
        if( !(bits ^ CellType.NE) || !(bits ^ CellType.NW) || !(bits ^ CellType.WS) || !(bits ^ CellType.ES)){
          turns++
        }
        this.mapContents[x][y].setRevealedAnim(bits)
      }
    }
    
    if(!this.humanIconActor){
      this.humanIconActor = new Sup.Actor("HumanIcon",this.actor);
      new Sup.SpriteRenderer(this.humanIconActor,"Graphics/MapTiles").setAnimation("Hero")
      this.humanIconActor.setLocalPosition(this.humanPosition.x-3,this.humanPosition.y-2,1)
    }
  }

  update() {
    this.humanIconActor.setLocalPosition(this.humanPosition.x-3,this.humanPosition.y-2,.1);
    
    this.mapContents[this.humanPosition.x][this.humanPosition.y].discover();
    
    let promptData = this.updatePrompt();
    if(promptData){
      this.exposeTile(promptData);
      this.prompt = null;
      this.promptActor.destroy();
      this.promptActor = null;
    }
    
    this.actor.setParent(Sup.getActor("Camera"))
    this.actor.setParent(null)
  }
  
  createTile(x,y,cellType:CellType = CellType.NWES){
    let tile = new Sup.Actor("MapTile",this.actor);
    let b = tile.addBehavior(MapTileBehavior);
    b.init(x-3,y-2,cellType);
    this.mapContents[x][y] = b;
  }
  
  // Exposes a tile based on the choice provided by the user
  // Position is relative to the human position
  exposeTile(choice:string){
    this.mapContents[this.humanPosition.x][this.humanPosition.y].finish();
    if(choice){
      if(choice == 'east'){
        this.humanPosition.x++;
      }
      if(choice == 'west'){
        this.humanPosition.x--;
      }
      if(choice == 'south'){
        this.humanPosition.y--;
      }
      if(choice == 'north'){
        this.humanPosition.y++;
      }
      if(this.humanPosition.x < 0 || this.humanPosition.y < 0){
        //this.awake();
        this.humanPosition.x = 0;
      }
    }
  }
  
  promptForNextMove(){
    let data = this.mapContents[this.humanPosition.x][this.humanPosition.y].complete();
    //if(data.length == 1){
    //  this.exposeTile(data[0]);
    //}else{
      this.generatePrompt(data);
    //}
  }
  
  generatePrompt(data:string[]){
    if(!this.prompt){
      this.prompt = data;
      this.promptActor = new Sup.Actor('Prompt');
      new Sup.TextRenderer(this.promptActor,"","Font");
      let text = ''
      for(let i = 0; i < this.prompt.length; i++){
        text += data[i] + '\n';
      }
      this.promptActor.textRenderer.setText(text);
      this.promptActor.textRenderer.setOpacity(1);
      this.promptActor.setPosition(0,0,4);
    }
  }
  
  updatePrompt(){
    let directions = {};
    if(this.prompt){
      for(let i = 0; i < this.prompt.length; i++){
        directions[this.prompt[i]] = true;
      }

      this.chosePrompt = true;
      if(directions['north'] && Sup.Input.wasKeyJustPressed('UP')){
        return 'north';
      }

      if(directions['east'] && Sup.Input.wasKeyJustPressed('RIGHT')){
        return 'east';
      }

      if(directions['west'] && Sup.Input.wasKeyJustPressed('LEFT')){
        return 'west';
      }

      if(directions['south'] && Sup.Input.wasKeyJustPressed('DOWN')){
        return 'south';
      }
      
      // We fell through all cases without returning, unset chosePrompt
      this.chosePrompt = false;
    }
    
    if(this.promptActor){
      // This can be replaced with a clickable UI menu
      for(let i = 0; i < this.prompt.length; i++){
        if(Sup.Input.wasKeyJustPressed(''+i)){
          this.chosePrompt = true;
          return this.prompt[i];
        }
      }
    }
    return null;
  }
  
  // Returns true exactly once if a prompt was chosen.
  choseNewTile(){
    if(this.chosePrompt){
      this.chosePrompt = false;
      return true;
    }
    return false;
  }
  
  
  private mapContents:MapTileBehavior[][];
  private humanIconActor:Sup.Actor;
  private humanPosition:{x:number,y:number};
  private questPosition:{x:number,y:number}[] = [];
  private prompt = null;
  private promptActor = null;
  private chosePrompt = false;
}
Sup.registerBehavior(MapBehavior);

enum CellType {
  NWES = 0b1111,
  N   = 0b1000,
  W   = 0b0100,
  E   = 0b0010,
  S   = 0b0001,
  NW  = 0b1100,
  NE  = 0b1010,
  NS  = 0b1001,
  WE  = 0b0110,
  WS  = 0b0101,
  ES  = 0b0011,
  NWE = 0b1110,
  NSE = 0b1011,
  NSW = 0b1101,
  SWE = 0b0111,
  Empty = 0b0000
}