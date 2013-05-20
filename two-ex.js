$(document).ready(createTwo);

function createTwo(){
var _Button = function Button(flag){
    this.flag = flag;
    this.mflag = flag;
    this.diffX = 0;
    this.diffY = 0;
    this.currX = document.getElementById("para").offsetLeft;
    this.currY = document.getElementById("para").offsetTop;
        console.log('initially, in constructor: flag=' + this.flag);
    //note that shift's keycode is 16, so please
    //do not change it.
    this.bVal = {
        'zoom': 2,
        'edit': 4,
        'move': 8,
        'shift': 16 
    };
}

var xpos = document.getElementById("para").offsetLeft;
var ypos = document.getElementById("para").offsetTop;
console.log(xpos+','+ypos);

var mouseAction = function(e){
    //Zoom in/out
    console.log('testing _b flag: ' + _b.flag);
    if(_b.flag & 2) {
        if (_b.flag & 16){
            group.scale -= 0.1;
        }
        else{
            group.scale += 0.1;
        }
    }
}

var or = 1<<1 | 1<<2;
var and = 1<<1 & 1<<2;
or |= 1<<4;
console.log('testing out ' + or);
console.log('testing out ' + and);


ifKeyPressed = function(e){
        console.log('initially, in inKeyPressed: flag=' + _b.flag);
    console.log('in inKeyPressed: key=' + e.keyCode);
    if(e.keyCode === 16){
        _b.flag |= 16;
        console.log('in inKeyPressed: flag=' + _b.flag);
        two.update();
    }
}

ifKeyUnpressed = function(e){
    console.log('in inKeyUnpressed: flag=' + e.keyCode);
    if(e.keyCode === 16){
        _b.flag -= 16;
        console.log('in inKeyUnpressed: flag=' + _b.flag);
        two.update();
    }
}

ifMousePressed = function(id){
    console.log("in function ifMousePressed, id=" + id);
    _b.flag = _b.bVal[id];
    console.log("in function ifMousePressed, flag=" + _b.flag);
    two.update();
}

ifMouseKept = function(e){
    if(_b.flag & 8){
        console.log('mouse down');
console.log('curr:' + _b.currX+','+_b.currY);
console.log(document.getElementById("para"));
        _b.mflag = 2;
        _b.diffX = _b.currX-e.clientX;
        _b.diffY = _b.currY-e.clientY;
    }
}

ifMouseMoved = function(e){
    if(_b.mflag & 2){
        console.log('moving mouse' + e.clientX + ',' + e.clientY);
        _b.currX = e.clientX + _b.diffX;
        _b.currY = e.clientY + _b.diffY;
        console.log(_b.currX + ";;;;;" + _b.currY);
        group.translation.set(_b.currX,_b.currY);
    }
}

ifMouseLeft = function(e){
    if(_b.mflag & 2){
        console.log('mouse up');
        _b.mflag -= 2;
        _b.diffX = 0;
        _b.diffY = 0;
    }
    //
}

var _b = new _Button(0);
var params = { width: 685, height: 400 };
    console.log( $("honey-comb").css("width")+","+ $("honey-comb").css("height"));
var two = new Two(params);

    document.onkeydown=ifKeyPressed;
    document.onkeyup=ifKeyUnpressed;
    document.getElementById("honey-comb").onmousedown=ifMouseKept;
    document.getElementById("honey-comb").onmouseup=ifMouseLeft;
    document.getElementById("honey-comb").onmousemove=ifMouseMoved;
    document.getElementById("para").onmousewheel=hoveringDude;
    document.getElementById("honey-comb").onclick=mouseAction;
    document.getElementById("buttons").onclick=function(e){
        console.log(e.target.id);
        ifMousePressed(e.target.id);
    };

    // Make an instance of two and place it on the page.
    var elem = document.getElementById('honey-comb').children[0];
    two.appendTo(elem);

    // two has convenience methods to create shapes.
    var radius = 20;
    var x_init = 60;
    var y_even_init = 60;
    var y_odd_init = y_even_init + 4*radius;
    var Rows = 10;
    var Cols = 12;
    var circles = [];
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
            var circle = two.makeCircle(x_curr, y_curr, radius);
            x_curr += 1.732*radius;

            // The object returned has many stylable properties:
            circle.fill = '#F2AA77';
            circle.stroke = 'black'; // Accepts all valid css color
            circle.linewidth = 1;
            circles.push(circle);
        }
    }
    var group = two.makeGroup(circles);
    _.extend(two,Backbone.Events);
    two.on("clicking", function(){
        alert('two was clicked!');
    });
    // Don't forget to tell two to render everything
    // to the screen
    
       x_curr = 0;
       var count = 0;
/*
       two.bind('mouseover',function(){
       circles[x_curr].fill = '#F2AA77';
       x_curr ++;
       circles[x_curr].fill = '#FFFFFF';
       //if(count > 60){
       count = 0;
        //console.log("next " + x_curr);
    //}
    count++;
    }).play();
*/    
    two.update();
    function hoveringDude(e){
        console.log('hovering: ' + e);
    }
function clickety(e){
    console.log(e);
    console.log(e.toElement);
    console.log(e.screenX + "," + e.screenY);
    console.log(e.clientX + "," + e.clientY);
    console.log("hi there");
}

}

