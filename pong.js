// Global variables
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    cHeight = ctx.canvas.height,
    cWidth = ctx.canvas.width,
    midY = ctx.canvas.height / 2,
    midX = ctx.canvas.width / 2,
    start = document.getElementById('subtext'),
    playerScore = 0,
    compScore = 0,
    gameState = true
    ctx.font = "32px 'Press Start 2P', cursive";

// Ball global
var ball = new Ball(midX, midY, 5, 5, '#FFFFFF');

// Paddle global variables
var paddleHeight = 50,
    paddleWidth = 10,
    paddleOffset = 10,
    compPaddleOffset = 580;
var playerPaddle = new Paddle( paddleHeight, paddleWidth, paddleOffset, midY, '#FFFFFF');
var computerPaddle = new Paddle( paddleHeight, paddleWidth, compPaddleOffset, midY, '#FFFFFF');

// Score globals
var compScoreY = 50,
    compScoreX = midX + midX / 2 - 32,
    playerScoreY = 50,
    playerScoreX = midX - midX / 2;


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
        //this.vx = false;
    } else if (this.x === 0) {
        //this.vx = true;
    }

    if (this.x == playerPaddle.x + playerPaddle.w) {
        if (this.y >= playerPaddle.y && this.y <= playerPaddle.y + playerPaddle.h) {
            this.vx = true;
        }
    }

    if (this.x == computerPaddle.x - computerPaddle.w) {
        if (this.y >= computerPaddle.y && this.y <= computerPaddle.y + computerPaddle.h) {
            this.vx = false;
        }
    }
}

Ball.prototype.move = function(ctx) {
    // Moves the ball depending on the direction of velocity
    if (this.vy === true) {
        this.y += 5;
    } else if (this.vy === false) {
        this.y -= 5;
    }

    if (this.vx === true) {
        this.x += 5;
    } else {
        this.x -= 5;
    }
}

Ball.prototype.resetPos = function(ctx) {
    // Called when a player scores and the ball position needs to be reset
    // within the canvas
    this.y = midY;
    this.x = midX;
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
    if (y - this.midH <= 0) {
        this.y = 0;
    } else if( y + this.midH > cHeight) {
        this.y = cHeight - this.h;
    } else {
        this.y = y - this.midH;
    }
}

Paddle.prototype.move = function() {
    // Check if the ball is greater than mid update if it is
    if (ball.x < midX) {
        if (ball.y > this.y) {
            this.updatePos(this.y + this.midH + 3);
        } else {
            this.updatePos(this.y + this.midH - 3);
        }
        return;
    }
    // We define position by the center paddle so we have to add this
    // in to the calculation
    if (ball.y > this.y) {
        this.updatePos(this.y + this.midH + 5);
    } else {
        this.updatePos(this.y + this.midH - 5);
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

function checkScore() {
    if (ball.x < 0) {
        compScore += 1;
        gameState = false;
    } else if (ball.x > cWidth) {
        playerScore += 1;
        gameState = false;
    }

}

function renderScore(ctx) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(compScore, compScoreX, compScoreY);
    ctx.fillText(playerScore, playerScoreX, playerScoreY);
}

// Does the actual rendering
function render() {
    ctx.clearRect(0, 0, cWidth, cHeight);
    colorBackground();
    ball.check_collide(ctx);
    ball.move(ctx);
    ball.draw(ctx);
    playerPaddle.draw(ctx);
    computerPaddle.move();
    computerPaddle.draw(ctx);
    checkScore();
    renderScore(ctx);
    // Someone scored so we need to reset the field
    if (!gameState) {
        setTimeout(function(){
            ball.resetPos(ctx);
            gameState = true;
        }, 100)
    } 
}

//Event Handlers
canvas.addEventListener('mousemove', function(e) {
    e.preventDefault();
    var position = canvas.getBoundingClientRect();
    var y = e.clientY - position.top;
    playerPaddle.updatePos(y);
}, false);

// Init function
function animLoop() {
    render();
    requestAnimationFrame(animLoop);
    //setInterval(animate, 1000 / 60, b, playerPaddle);
}

// Start of the game
start.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    menu.style.display = 'none';
    canvas.style.cursor = 'none';
    animLoop();
}

colorBackground();
