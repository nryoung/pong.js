var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    midY = ctx.canvas.height / 2,
    midX = ctx.canvas.width / 2;



// Our ball object, actually represents the Pong to be passed around
function Ball(x, y, w, h, fill) {
    // our constructor of sorts
    // unsafe, need to add type checking
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fill = fill;
}

Ball.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}





// Init function 
function init() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var b = new Ball(midX, midY, 5, 5, '#FFFFFF');
    b.draw(ctx);
}


// Start of the game
init();
