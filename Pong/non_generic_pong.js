var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 480;
var X_MARGIN = 15;
var Y_MARGIN = 15;
var PADDLE_X_SIZE = 15;
var PADDLE_Y_SIZE = 60;

var isMovingUp = false;
var isMovingDown = false;

function Ball(radius, initialX, initialY, initialDx, initialDy) {
	this.radius = radius;
	this.x = initialX;
	this.y = initialY;
	this.dx = initialDx;
	this.dy = initialDy;

	this.draw = function() {
		ctx.beginPath();
	  ctx.fillStyle = "#FF0000";
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.strokeStyle="#000000";
	  ctx.fill();
	  ctx.stroke();
		ctx.closePath();
	}
	this.update = function() {
		this.x += this.dx;
		this.y += this.dy;

		if (this.y >= (480 - this.radius)) {
			this.y = (480 - this.radius);
			this.dy = -this.dy;
		}
		if (this.y < 10) {
			this.y = 10;
			this.dy = -this.dy;
		}
	}
	return this;
}

function Paddle(width, height, initialX, initialY, initialDx, initialDy) {
	this.width = width;
	this.height = height;
	this.x = initialX;
	this.y = initialY;
	this.dx = initialDx;
	this.dy = initialDy;

	this.draw = function() {
		console.log(this.x.toString() + ' - ' + this.y.toString());
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = "#00AA22";
		ctx.strokeStyle="#000000";
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}

	this.update = function() {
		this.x += this.dx;
		this.y += this.dy;

		if (this.y >= (SCREEN_HEIGHT - this.height)) {
			this.y = (SCREEN_HEIGHT - this.height);
			this.dy = -this.dy;
		}
		if (this.y < 0) {
			this.y = 0;
		}
	}
	return this;
}

function keyDownHandler(event) {
	if (event.keyCode == 38) {
		isMovingUp = true;
		isMovingDown = false;
	} else if  (event.keyCode == 40) {
		isMovingUp = false;
		isMovingDown = true;
	}
}

function keyUpHandler(event) {
	if ((event.keyCode == 38) || (event.keyCode == 40)) {
		isMovingUp = false;
		isMovingDown = false;
	}
}

function clearScreen() {
	ctx.clearRect(0, 0, 800, 480);
}

function drawAll() {
	ctx.imageSmoothingEnabled = true;
	if (isMovingDown) {
		y += 10;
	} else if (isMovingUp) {
		y -= 10;
	}
	ball.update();
	clearScreen();
	ball.draw();
	paddles.forEach(function(paddle, index) {
		paddle.draw();
	});
}

var ball = new Ball(10, 400, 240, 2, 2);
var paddles = [new Paddle(PADDLE_X_SIZE, PADDLE_Y_SIZE, X_MARGIN + PADDLE_X_SIZE, (SCREEN_HEIGHT/2)-(PADDLE_Y_SIZE/2), 0, 0 ),
							 new Paddle(PADDLE_X_SIZE, PADDLE_Y_SIZE, SCREEN_WIDTH - X_MARGIN - PADDLE_X_SIZE, (SCREEN_HEIGHT/2)-(PADDLE_Y_SIZE/2), 0, 0 )];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

setInterval(drawAll, 10);
