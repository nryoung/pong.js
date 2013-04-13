// Global variables
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    height = ctx.canvas.height,
    width = ctx.canvas.width,
    midY = ctx.canvas.height / 2,
    midX = ctx.canvas.width / 2;


//-----------------------------------------------------------------------------
// Our ball object, actually represents the Pong to be passed around
function Ball(x, y, w, h, fill) {
    // our constructor of sorts
    // unsafe, need to add type checking
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fill = fill;

    // direction of where the ball is going
    this.vx = true;
    this.vy = true;
}

Ball.prototype.draw = function(ctx) {
    // Draws the ball on the canvas
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}

Ball.prototype.check_collide = function(ctx) {
    // Checks if the ball has collided with the top or bottom edges
    // If it has it reverses the direction
    if (this.y === height) {
        this.vy = false;
    } else if (this.y === 0) {
        this.vy = true;
    }

    if (this.x === width) {
        this.vx = false;
    } else if (this.x === 0) {
        this.vx = true;
    }
}

Ball.prototype.move = function(ctx) {
    // Moves the ball depending on the direction of velocity
    if (this.vy === true) {
        this.y += 5;
    } else if (this.vy === false) {
        this.y -= 5;
    }

    if (this.vx == true) {
        this.x += 5;
    } else {
        this.x -= 5;
    }
}

//-----------------------------------------------------------------------------




//-----------------------------------------------------------------------------
// Helper functions
function colorBackground() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
}

function animate(b) {
    ctx.clearRect(0, 0, width, height);
    colorBackground();
    b.check_collide(ctx);
    b.move(ctx);
    b.draw(ctx);

}
//-----------------------------------------------------------------------------


// Init function
function init() {
    colorBackground();
    var b = new Ball(midX, midY, 5, 5, '#FFFFFF');
    b.draw(ctx);
    setInterval(animate, 1000 / 60, b);
}


// Start of the game
init();
