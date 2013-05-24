$(document).ready(START);

function START(){
   var dc = new DocumentController();
}

/* MODELS HERE */

function PartItem(){
    this.LatticeType_ = 0; //HoneyComb
    this.currEvenHelix_ = -2; //Helix Numbering
    this.currOddHelix_ = -1; //Helix Numbering
    this.part_ = {}; //Stores all the virtual helix items.
    this.circles_ = []; //Stores the virtual helix polygons.
}

PartItem.prototype.getHelix = function(id){
    return this.part_[id];
};

PartItem.prototype.setHelix = function(key, helix){
    if(key){
        this.part_[key] = helix;
    }
};

PartItem.prototype.getHelices = function(){
    return this.circles_;
};

PartItem.prototype.addHelix = function(polygon){
    if(polygon){
        this.circles_.push(polygon);
    }
};

PartItem.prototype.getNextEvenHelixID = function(id){
    this.currEvenHelix_+=2;
    return this.currEvenHelix_;
};

PartItem.prototype.getNextOddHelixID = function(id){
    this.currOddHelix_+=2;
    return this.currOddHelix_;
};
//////////////////////////////////////////////////////////////////

function Stack(){
    this.storage_ = new Array();
}

Stack.prototype.topMost = function(){
    return this.storage_[this.storage_.length-1];
};

Stack.prototype.pop = function(){
    return this.storage_.pop();
};

Stack.prototype.push = function(action){
    this.storage_.push(action);
};

function Document(){
    this.undoStack = new Stack();
}


function Button(flag){
    this.flag = flag;
    this.mouseClickedFlag = flag;
    this.diffX = 0;
    this.diffY = 0;
    this.currX = 0;
    this.currY = 0;
    console.log('initially, in constructor: flag=' + this.flag);

    //note that shift's keycode is 16, so please
    //do not change it.
    this.bVal = {
        'zoom': 2,
        'edit': 4,
        'move': 8,
        'shift': 16 
    };
    this.previousHelix_ = undefined;
}

Button.prototype.getCurrX = function(){
    return this.currX;
};

Button.prototype.getCurrY = function(){
    return this.currY;
};

Button.prototype.setCurrX = function(posn){
    this.currX = posn;
};

Button.prototype.setCurrY = function(posn){
    this.currY = posn;
};

Button.prototype.setPreviousHelix = function(id){
    if(id){
        this.previousHelix_ = id;
    }
};

Button.prototype.previousHelix = function(){
        return this.previousHelix_;
};

Button.prototype.mouseHover = function(e, view){
    if(!e.target.id) return;
    if ((this.flag & 4)){
        var foo = $.proxy(view.dispatch, view);
        keyOn = {
            action: 'hover',
            val: e.target.id
        };
        keyOff = {
            action: 'nohover',
            val: this.previousHelix()
        };
        foo(keyOn);
        console.log(this.previousHelix());
        foo(keyOff);
        console.log(this.previousHelix() + '-to-' + e.target.id);
        this.setPreviousHelix(e.target.id);
        console.log(e);
    }
};

Button.prototype.mouseAction = function(e, view){
    //Zoom in/out
    if(!e.target.id) return;

    console.log('testing _b flag: ' + this.flag);
    var foo = $.proxy(view.dispatch, view);
    var key = {
        action: 'zoom',
        val: 0
    };
    if(this.flag & 2) {
        if (this.flag & 16){
            key.val = -0.1;
        }
        else{
            key.val = 0.1;
        }
        foo(key);
    } else if (this.flag & 4){
        //trying to read in the svg node.
        key = {
            action: 'edit',
            val: e.target.id
        };
        console.log(e.target.id);
        foo(key);
    }
};

Button.prototype.ifKeyPressed = function(e){
    console.log(this);
    console.log('testing: in inKeyPressed: get=' + this.getCurrX() + "," + this.getCurrY() );
    console.log('initially, in inKeyPressed: flag=' + this.flag);
    console.log('in inKeyPressed: key=' + e.keyCode);
    if(e.keyCode === 16){
        this.flag |= 16;
        console.log('in inKeyPressed: flag=' + this.flag);
    }
};

Button.prototype.ifKeyUnpressed = function(e){
    console.log('in inKeyUnpressed: flag=' + e.keyCode);
    if(e.keyCode === 16){
        this.flag -= 16;
        console.log('in inKeyUnpressed: flag=' + this.flag);
    }
};

Button.prototype.ifMousePressed = function(id){
    console.log("in function ifMousePressed, id=" + id);
    this.flag = this.bVal[id];
    console.log("in function ifMousePressed, flag=" + this.flag);
};

Button.prototype.ifMouseKept = function(e){
    if(this.flag & 8){
        console.log(this);
        console.log('mouse down');
        console.log('curr:' + this.getCurrX()+','+this.getCurrY());
        this.mouseClickedFlag = 2;
        this.diffX = this.getCurrX()-e.clientX;
        this.diffY = this.getCurrY()-e.clientY;
    }
};

Button.prototype.Zoom = function(e,view){
    //Zoom in/out
    if(!e.target.id) return;

    if(this.flag & 2) {
        console.log('testing _b flag: ' + this.flag);
        var delta=e.detail? e.detail*(-120) : e.wheelDelta;
        console.log('delta=' + delta + ',detail:' + e.detail + ',e.wheelDelta=' + e.wheelDelta);
        var zoomval = delta/240;
        console.log(zoomval);
        var foo = $.proxy(view.dispatch, view);
        var key = {
            action: 'zoom',
            val: zoomval
        };
        console.log('calling foo');
        foo(key);
    }
};

Button.prototype.ifMouseMoved = function(e,view){
    if(!e.target.id) return;
    if(this.mouseClickedFlag & 2){
        console.log(this);
        console.log('moving mouse' + e.clientX + ',' + e.clientY);
        this.setCurrX(e.clientX + this.diffX);
        this.setCurrY(e.clientY + this.diffY);
        console.log(this.getCurrX() + ";;;;;" + this.getCurrY());
        var key = {
            action: 'move', 
            x: this.getCurrX(), 
            y: this.getCurrY()
        }; 
        var foo = $.proxy(view.dispatch, view);
        foo(key);
    }
};

Button.prototype.ifMouseLeft = function(e){
    if(this.mouseClickedFlag & 2){
        console.log('mouse up');
        this.mouseClickedFlag -= 2;
        this.diffX = 0;
        this.diffY = 0;
    }
    //
};

/* VIEWS HERE */
function VirtualHelixItem(r,c){
    this.row_ = r;
    this.col_ = c;
    this.isSelected_ = false;
    this.id_ = -1;
}

VirtualHelixItem.prototype.setRowCol = function(r, c){
    this.row_ = r;
    this.col_ = c;
};

VirtualHelixItem.prototype.getPolygon = function(){
    return this.polygon_;
};

VirtualHelixItem.prototype.make = function(two,x,y,r){
    this.polygon_ = two.makeCircle(x,y,r);

    // The object returned has many stylable properties:
    this.polygon_.fill = '#D4D4D4';
    this.polygon_.stroke = 'black';
    this.polygon_.linewidth = 1;
    return this.polygon_;
};

VirtualHelixItem.prototype.hover = function(){
    console.log('eh there');
    if(this.isSelected_ === false){
        this.polygon_.linewidth = 3;
        this.polygon_.fill = '#5F7DF5';
        this.polygon_.stroke = '#1B39E0';
    }
};

VirtualHelixItem.prototype.nohover = function(){
    console.log('eh there bye');
    if(this.isSelected_ === false){
        this.polygon_.linewidth = 1;
        this.polygon_.fill = '#D4D4D4';
        this.polygon_.stroke = 'black';
    }
};

VirtualHelixItem.prototype.select = function(id){
    if(this.isSelected_ === false){
        this.polygon_.linewidth = 1;
        this.polygon_.fill = '#EB7A42';
        this.polygon_.stroke = '#D64C06';
        this.isSelected_ = true;
        this.id_ = id;
        console.log('new helix id = '+id);
    }
};

VirtualHelixItem.prototype.getSvgID = function(){
    return this.polygon_.id;
};

VirtualHelixItem.prototype.isEvenParity = function(){
    return ((this.row_ % 2) === (this.col_ % 2));
}

VirtualHelixItem.prototype.isOddParity = function(){
    return ((this.row_ % 2) ^ (this.col_ % 2));
}

/* CONTROLLERS HERE */

DocumentItem = function(){
    var w = $('#slice-view').css('width');
    var h = $('#slice-view').css('height');
    this.params_ = { type: Two.Types.svg, width: w, height: h };
    this.two_ = new Two(this.params_);
    this.started_ = new signals.Signal();
    this.part_ = new PartItem();
}

DocumentItem.prototype.update = function(key){
    if(key.action === 'zoom'){
        var newScale = this.group_.scale + key.val;
        if(newScale < 0.3){
            this.group_.scale = 0.3;
        }
        else if (newScale > 3){
            this.group_.scale = 3;
        }
        else {
            this.group_.scale = newScale;
        }
    }
    else if (key.action === 'move'){
        this.group_.translation.set(key.x, key.y);
    }
    else if (key.action === 'edit'){
        var helix = this.part_.getHelix(key.val);
        var id;
        if(helix.isEvenParity()){
            id = this.part_.getNextEvenHelixID();
        }
        else {
            id = this.part_.getNextOddHelixID();
        }
        var foo = $.proxy(helix.select,helix);
        foo(id);
    }
    else if (key.action === 'hover' && key.val){
        var helix = this.part_.getHelix(key.val);
        if(helix){
            var foo = $.proxy(helix.hover,helix);
            foo();
        }
    }
    else if (key.action === 'nohover' && key.val){
        var helix = this.part_.getHelix(key.val);
        if(helix){
            var foo = $.proxy(helix.nohover,helix);
            foo();
        }
    }

    // Don't forget to tell two to render everything
    // to the screen
    this.two_.update();
};

DocumentItem.prototype.dispatch = function(key){
    console.log(this);
    this.started_.dispatch(key);
};

DocumentItem.prototype.init = function(){

    // Link signal handlers
    this.started_.add($.proxy(this.update,this));
    // Make an instance of two and place it on the page.
    var elem = document.getElementById('slice-view').children[0];
    this.two_.appendTo(elem);
    this.part_.createHoneyComb(this.two_);

    this.group_ = this.two_.makeGroup(this.part_.getHelices());
    this.two_.update();
};

PartItem.prototype.createHoneyComb = function(twoHandler){

    // two has convenience methods to create shapes.
    var radius = 20;
    var x_init = 60;
    var y_even_init = 60;
    var y_odd_init = y_even_init + 4*radius;
    var Rows = 50;
    var Cols = 50;
    for(var row = 0; row<Rows; row++){
        x_curr = x_init;
        if(row % 2 === 0){
            y_even = y_even_init + 6*radius*(row/2);
            y_odd = y_even + radius;
        }
        else{
            y_even = y_odd_init + 6*radius*((row-1)/2);
            y_odd = y_even - radius;
        }

        for(var col = 0; col<Cols; col++){
            if(col % 2 === 0){
                y_curr = y_even;
            }
            else {
                y_curr = y_odd;
            }

            var helix = new VirtualHelixItem(row,col);
            helix.make(twoHandler,x_curr,y_curr,radius);
            twoHandler.add(helix.getPolygon());
            var k = 'two-' + helix.getSvgID();
            this.setHelix(k, helix);

            x_curr += 1.732*radius;
            this.addHelix(helix.getPolygon());
        }
    }
};

    /* Controllers */
function DocumentController(){
    //click edit
    //click scroll/zoom
    //click honey comb
    //click square
    //actual mouse movements

    sliceView = new DocumentItem();
    sliceView.init();

    editMenu = new Button(0);
    editMenu.setCurrX(document.getElementById("lattice").offsetLeft);
    editMenu.setCurrY(document.getElementById("lattice").offsetTop);
    console.log(editMenu.getCurrX()+','+editMenu.getCurrY());

    document.onkeydown=$.proxy(editMenu.ifKeyPressed, editMenu);
    document.onkeyup=$.proxy(editMenu.ifKeyUnpressed, editMenu);
    document.getElementById("slice-view").onmousedown=$.proxy(editMenu.ifMouseKept, editMenu);
    document.getElementById("slice-view").onmouseup=$.proxy(editMenu.ifMouseLeft, editMenu);

    document.getElementById("complete-doc").onmousewheel=function(e){
        var foo = $.proxy(editMenu.Zoom,editMenu);
        foo(e,sliceView);
    };
    document.getElementById("slice-view").onmousemove=function(e){
        var foo = $.proxy(editMenu.ifMouseMoved,editMenu);
        foo(e,sliceView);
    };
    document.getElementById("slice-view").onmouseover=function(e){
        var foo = $.proxy(editMenu.mouseHover,editMenu);
        foo(e,sliceView);
    };
    document.getElementById("slice-view").onclick=function(e){
        var foo = $.proxy(editMenu.mouseAction,editMenu);
        foo(e,sliceView);
    };
    document.getElementById("buttons").onclick=function(e){
        console.log(e.target.id);
        var foo = $.proxy(editMenu.ifMousePressed,editMenu);
        foo(e.target.id);
    };
}
