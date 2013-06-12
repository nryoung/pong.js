// Global canvas variables
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


// Ball definition
//-----------------------------------------------------------------------------/
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

    // speed of the ball
    this.vy_speed = 5;
}

Ball.prototype.draw = function(ctx) {
    // Draws the ball on the canvas
    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}

Ball.prototype.checkCollide = function(ctx) {
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
        this.y += this.vy_speed;
    } else if (this.vy === false) {
        this.y -= this.vy_speed;
    }

    if (this.vx === true) {
        this.x += 5;
    } else {
        this.x -= 5;
    }

    // If the ball is outside the bounds of the canvas then we just set
    // it to the canvas limits
    if (this.y > cHeight) {
            this.y = cHeight;
        }
    else if (this.y < 0) {
            this.y = 0;
        }

}

Ball.prototype.resetPos = function(ctx) {
    // Called when a player scores and the ball position needs to be reset
    // within the canvas
    this.y = midY;
    this.x = midX;
    this.vy_speed = this.randomizeMovement();
}

Ball.prototype.randomizeMovement = function() {
    var min = 5,
        max = 10;
    return Math.floor( Math.random() * (max - min) + min);
}
//-----------------------------------------------------------------------------/


// Paddle Object
//-----------------------------------------------------------------------------/
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
//-----------------------------------------------------------------------------/


// Helper functions
//-----------------------------------------------------------------------------/


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

function renderBackground() {
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cWidth, cHeight);
    ctx.beginPath()
    ctx.dashedLine(midX, 0, midX, cHeight, 10);
    ctx.stroke()
}

CanvasRenderingContext2D.prototype.dashedLine = function (x1, y1, x2, y2, dashLength) {
    dashLength = dashLength === undefined ? 5 : dashLength;

    var deltaX = x2 - x1,
        deltaY = y2 - y1,
        numDashes = Math.floor(
                Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);
    for (var i = 0; i < numDashes; ++i) {
        ctx[ i % 2 === 0 ? 'moveTo' : 'lineTo' ]
            (midX + (deltaX / numDashes) * i, 0 + (deltaY / numDashes) * i);
    }
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
    renderBackground();
    ball.checkCollide(ctx);
    ball.move(ctx);
    ball.draw(ctx);
    playerPaddle.draw(ctx);
    computerPaddle.move();
    computerPaddle.draw(ctx);
    checkScore();
    renderScore(ctx);
    // Someone scored so we need to reset the field
    if (!gameState) {
        ball.resetPos(ctx);
        gameState = true;
    }
}
//-----------------------------------------------------------------------------/

//Event Handlers
//-----------------------------------------------------------------------------/
canvas.addEventListener('mousemove', function(e) {
    e.preventDefault();
    var position = canvas.getBoundingClientRect();
    var y = e.clientY - position.top;
    playerPaddle.updatePos(y);
}, false);
//-----------------------------------------------------------------------------/

// Init functions
//-----------------------------------------------------------------------------/
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

renderBackground();
//-----------------------------------------------------------------------------/
