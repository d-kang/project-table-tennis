var canvas
var canvasContext;
var scoreLeftPlayer = 0;
var scoreRightPlayer = 0;
var showingWinScreen = false;
var ball = {
  X: 50,
  Y: 50,
}
//ball control
var speedOfBall = 15
var ballSpeed = {
  X: speedOfBall,
  Y: speedOfBall * 0.4,
  curve: speedOfBall * 0.035
}
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
const WINNING_SCORE = 3;
var paddle = {
  leftPlayer: 250,
  rightPlayer: 250,
};
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}
function handleMouseClick(evt) {
  if (showingWinScreen) {
    scoreLeftPlayer = 0;
    scoreRightPlayer = 0;
    showingWinScreen = false;
  }
}
window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  var framesPerSecond = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  //    console.log(ballX)
  }, 1000 / framesPerSecond);
  canvas.addEventListener('mousedown', handleMouseClick);
  canvas.addEventListener('mousemove',
  function(evt) {
    var mousePos = calculateMousePos(evt);
    paddle.leftPlayer = mousePos.y - (PADDLE_HEIGHT / 2);
  });
}
function ballReset() {
  if (scoreLeftPlayer >= WINNING_SCORE ||
    scoreRightPlayer >= WINNING_SCORE) {
    //scoreLeftPlayer = 0;
    //scoreRightPlayer = 0;
    showingWinScreen = true;
  }
  ballSpeed.X = -ballSpeed.X
  ball.X = canvas.width / 2;
  ball.Y = canvas.height / 2;
}
function computerMovementLeft() {
  var centerLeftPaddle = paddle.leftPlayer + (PADDLE_HEIGHT / 2)
  if (centerLeftPaddle < ball.Y - 25) {
    paddle.leftPlayer += 6;
  } else if (centerLeftPaddle > ball.Y + 25) {
    paddle.leftPlayer -= 6;
  }
}
function computerMovementRight() {
  var centerRightPaddle = paddle.rightPlayer + (PADDLE_HEIGHT / 2)
  if (centerRightPaddle < ball.Y - 25) {
    paddle.rightPlayer += 6
  } else if (centerRightPaddle > ball.Y + 25) {
  paddle.rightPlayer -= 6;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }
  computerMovementRight();
  //computerMovementLeft();
  ball.X += ballSpeed.X
  ball.Y += ballSpeed.Y
  //ball passes left canvas
  if (ball.X < 0) {
    if (ball.Y > paddle.leftPlayer && ball.Y < paddle.leftPlayer + PADDLE_HEIGHT) {
      ballSpeed.X = -ballSpeed.X;
      var deltaY = ball.Y - (paddle.leftPlayer + PADDLE_HEIGHT / 2);
      ballSpeed.Y = deltaY * ballSpeed.curve;
    } else {
      scoreRightPlayer++; // must be BEFORE ballReset()
      ballReset();
    }
  }
    //ball passes right canvas
  if (ball.X > canvas.width) {
    if (ball.Y > paddle.rightPlayer &&
      ball.Y < paddle.rightPlayer + PADDLE_HEIGHT) {
      ballSpeed.X = -ballSpeed.X
      var deltaY = ball.Y - (paddle.rightPlayer + PADDLE_HEIGHT / 2);
      ballSpeed.Y = deltaY * ballSpeed.curve;
    } else {
      scoreLeftPlayer++; // must be before ballReset()
      ballReset();
    }
  }
  if (ball.Y < 0) {
    ballSpeed.Y = -ballSpeed.Y
  }
  if (ball.Y > canvas.height) {
    ballSpeed.Y = -ballSpeed.Y
  }
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 30, 'white');
  }
}
function drawEverything() {
  //next line blanks out the screen with black
  canvasContext.font = "25px serif";
  colorRect(0, 0, canvas.width, canvas.height, 'black');
  if (showingWinScreen) {

    canvasContext.fillStyle = 'white';
    if (scoreLeftPlayer >= WINNING_SCORE) {
      canvasContext.fillText("Left Player Won!", 320, 200);
    } else if (scoreRightPlayer >= WINNING_SCORE) {
     canvasContext.fillText("Right Player Won!", 320, 200);
    }
    canvasContext.fillText("click to continue", 320, 500);

    }
    drawNet();
    //next line draws ball.X
    colorCircle(ball.X, ball.Y, 10, 'white')
    //this is left player paddle
    colorRect(0, paddle.leftPlayer, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    //this is right computer paddle
    colorRect(canvas.width - PADDLE_THICKNESS, paddle.rightPlayer, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    canvasContext.fillText(scoreLeftPlayer, 300, 20);
    canvasContext.fillText(scoreRightPlayer, canvas.width - 300, 20);
}
function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true)
  canvasContext.fill();
}
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
