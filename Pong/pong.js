var mainCanvas = document.getElementById("gameCanvas");
var mainContext = mainCanvas.getContext("2d");
var gameIsRunning = true;
var animationId;

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 480;
var X_MARGIN = 15;
var Y_MARGIN = 60;
var PADDLE_X_SIZE = 15;
var PADDLE_Y_SIZE = 60;

var PADDLE_Y_SPEED = 5;

function Score(value, initialX, initialY, initialDx, initialDy) {
	var component = this;
	component.value = value;
	component.x = initialX;
	component.y = initialY;
	component.dx = initialDx;
	component.dy = initialDy;

	component.increase = function() {
		component.value++;
	}

	component.decrease = function() {
		component.value++;
	}

	component.update = function() {
		component.x += component.dx;
		component.y += component.dy;
	}

	component.draw = function() {
		mainContext.font="50px Courier Black";
		mainContext.lineWidth="1";
		mainContext.strokeStyle="Black";
		mainContext.fillStyle="Black";
		mainContext.fillText(component.value.toString(), component.x, component.y);
	}

	return component;
}

function Field() {
	var component = this;

	component.update = function() {
		return 0;
	}

	component.draw = function () {
		mainContext.beginPath();
		mainContext.rect(0,0, SCREEN_WIDTH, SCREEN_HEIGHT);
		mainContext.fillStyle = "#CCCCFF";
		mainContext.strokeStyle = "#000000";
		mainContext.fill();
		mainContext.stroke();
		mainContext.closePath();
		mainContext.beginPath();
		mainContext.strokeStyle = "#AA8800";
		mainContext.moveTo(0, 60);
		mainContext.lineTo(SCREEN_WIDTH, 60);
		mainContext.stroke();
		mainContext.closePath();
		mainContext.beginPath();
		mainContext.strokeStyle = "#000000";
		mainContext.moveTo(SCREEN_WIDTH/2, 0);
		mainContext.lineTo(SCREEN_WIDTH/2, SCREEN_HEIGHT);
		mainContext.stroke();
		mainContext.closePath();
		mainContext.beginPath();
		mainContext.arc(SCREEN_WIDTH/2, (SCREEN_HEIGHT/2)+20, 80, 0, 2*Math.PI);
		mainContext.stroke();
		mainContext.closePath();
	}

	return component;
}

function Ball(radius, initialX, initialY, initialDx, initialDy) {
	var component = this;
	component.radius = radius;
	component.x = initialX;
	component.y = initialY;
	component.dx = initialDx;
	component.dy = initialDy;
	component.currentSpeed = 1;
	component.maxSpeed = 10;

	component.draw = function() {
		mainContext.beginPath();
	  mainContext.fillStyle = "#FF0000";
		mainContext.arc(component.x, component.y, component.radius, 0, Math.PI*2);
		mainContext.strokeStyle="#000000";
	  mainContext.fill();
	  mainContext.stroke();
		mainContext.closePath();
	}

	component.respawn = function() {
		component.x = SCREEN_WIDTH/2;
		component.y = SCREEN_HEIGHT/2;
		component.dx = (component.dx > 0) ? -2 : 2;
		component.dy = (component.dy > 0) ? -2 : 2;
		component.currentSpeed = 1;
	}

	component.bounceFaster = function() {
		if (component.currentSpeed < component.maxSpeed) {
			component.dx = (1.1 * component.dx)
			component.dy = (1.1 * component.dy)
			component.currentSpeed++;
		}
		component.dx = -component.dx;
	}

	component.update = function() {
		component.x += component.dx;
		component.y += component.dy;

		if (component.y >= (SCREEN_HEIGHT - component.radius)) {
			component.y = (SCREEN_HEIGHT - component.radius);
			component.dy = -component.dy;
		}
		if (component.y < Y_MARGIN + component.radius) {
			component.y = Y_MARGIN + component.radius;
			component.dy = -component.dy;
		}

		if (component.x >= (players[1].paddle.x - component.radius)) {
			if ((component.y >= players[1].paddle.y) && (component.y <= (players[1].paddle.y+players[1].paddle.height))) {
				component.bounceFaster();
			} else {
				players[0].score.increase();
				component.respawn();
			}
		}

		if (component.x <= (players[0].paddle.x + component.radius + players[0].paddle.width)) {
			if ((component.y >= players[0].paddle.y) && (component.y <= (players[0].paddle.y+players[0].paddle.height))) {
				component.bounceFaster();
			} else {
				players[1].score.increase();
				component.respawn();
			}
		}
	}

	return component;
}

function Paddle(width, height, initialX, initialY, initialDx, initialDy) {
	var component = this;
	component.width = width;
	component.height = height;
	component.x = initialX;
	component.y = initialY;
	component.dx = initialDx;
	component.dy = initialDy;
	component.isMovingUp = false;
	component.isMovingDown = false;

	component.draw = function() {
		mainContext.beginPath();
		mainContext.rect(component.x, component.y, component.width, component.height);
		mainContext.fillStyle = "#00AA22";
		mainContext.strokeStyle="#000000";
		mainContext.fill();
		mainContext.stroke();
		mainContext.closePath();
	}

	component.moveUp = function() {
			component.dy = -PADDLE_Y_SPEED;
	}

	component.moveDown = function() {
			component.dy = PADDLE_Y_SPEED;
	}

	component.stopMoving = function() {
			component.dy = 0;
	}

	component.update = function() {
		component.x += component.dx;
		component.y += component.dy;

		if (component.y >= (SCREEN_HEIGHT - component.height)) {
			component.y = (SCREEN_HEIGHT - component.height);
		}
		if (component.y < Y_MARGIN) {
			component.y = Y_MARGIN;
		}
	}
	return component;
}

function Player(paddleWidth, paddleHeight, paddleX, paddleY, scoreX, scoreY) {
	var component = this;
	component.paddle = new Paddle(paddleWidth, paddleHeight, paddleX, paddleY, 0, 0);
	component.score = new Score(0, scoreX, scoreY, 0, 0);
}

function keyDownHandler(event) {
	if (event.keyCode in keyDownMapping) {
		keyDownMapping[event.keyCode]();
	}
}

function keyUpHandler(event) {
	if (event.keyCode in keyUpMapping) {
		keyUpMapping[event.keyCode]();
	}
}

function clearScreen() {
	mainContext.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function pauseOrResumeGame() {
	if (gameIsRunning) {
		cancelAnimationFrame(animationId);
	} else {
		animationId = requestAnimationFrame(drawAll);
	}
	gameIsRunning = !gameIsRunning;
}

function drawAll() {
	gameObjects.forEach(function(gameObject, index) {
		gameObject.update();
	});
	clearScreen();
	gameObjects.forEach(function(gameObject, index) {
		gameObject.draw();
	});
	animationId = requestAnimationFrame(drawAll);
}

var ball = new Ball(10, 400, 240, 2, 2);

var players = [new Player(PADDLE_X_SIZE, PADDLE_Y_SIZE, X_MARGIN, (SCREEN_HEIGHT/2)-(PADDLE_Y_SIZE/2), 80, 50 ),
							 new Player(PADDLE_X_SIZE, PADDLE_Y_SIZE, SCREEN_WIDTH - X_MARGIN - PADDLE_X_SIZE, (SCREEN_HEIGHT/2)-(PADDLE_Y_SIZE/2), 700, 50 )]
var gameObjects = [new Field(), ball, players[0].paddle, players[1].paddle, players[0].score, players[1].score];

var keyDownMapping = { 80: pauseOrResumeGame, 87: players[0].paddle.moveUp, 83: players[0].paddle.moveDown, 38: players[1].paddle.moveUp, 40: players[1].paddle.moveDown};
var keyUpMapping = { 87: players[0].paddle.stopMoving, 83: players[0].paddle.stopMoving, 38: players[1].paddle.stopMoving, 40: players[1].paddle.stopMoving};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
animationId = requestAnimationFrame(drawAll);
