// Global variables
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    cHeight = ctx.canvas.height,
    cWidth = ctx.canvas.width,
    midY = ctx.canvas.height / 2,
    midX = ctx.canvas.width / 2;

// Ball global
var ball = new Ball(midX, midY, 5, 5, '#FFFFFF');

// Paddle global variables
var paddleHeight = 50,
    paddleWidth = 10,
    paddleOffset = 10;
var playerPaddle = new Paddle( paddleHeight, paddleWidth, paddleOffset, midY, '#FFFFFF');



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
    if (this.y === cHeight) {
        this.vy = false;
    } else if (this.y === 0) {
        this.vy = true;
    }

    if (this.x === cWidth) {
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



// Paddle Object
function Paddle( h, w, x, y, fill) {
    this.h = h;
    this.w = w;
    this.midH = h / 2;

    this.x = x;
    this.y = y;
    this.fill = fill;
}

Paddle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}

Paddle.prototype.updatePos = function(y) {
    // Check if paddle is hitting edges
    if (y - this.h <= 0) {
        this.y = 0;
    } else if( y + 5 > cHeight) {
        this.y = cHeight - this.h;
    } else {
        this.y = y - this.h;
    }
}

// Helper functions

// requestAnimFrame for smoother animations
window.requestAnimationFrame = (function() {
    return (
           window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           function( callback ){
               window.setTimeout(callback, 1000 / 60);
           }
        );
})();

function colorBackground() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cWidth, cHeight);
}

// Does the actual rendering
function render() {
    ctx.clearRect(0, 0, cWidth, cHeight);
    colorBackground();
    ball.check_collide(ctx);
    ball.move(ctx);
    ball.draw(ctx);
    playerPaddle.draw(ctx);
}

//Event Handlers
canvas.onmousemove = function(e) {
    e.preventDefault();
    y = e.clientY;
    playerPaddle.updatePos(y);
}

// Init function
function animLoop() {
    render();
    requestAnimationFrame(animLoop);
    //setInterval(animate, 1000 / 60, b, playerPaddle);
}

// Start of the game
animLoop();
