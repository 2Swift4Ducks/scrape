// Game configuration
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const paddleWidth = 100;
const paddleHeight = 10;
const paddleSpeed = 7;

const brickRowCount = 5;
const brickColumnCount = 10;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const img_bg = new Image()
img_bg.src = './bg.png'
img_bg.onload = function() {
	context.drawImage(img_bg, 0, 0)
	drawBricks();
	drawPaddle();
	drawBall();
	drawScore();
	drawLives();
}

let score = 0;
let lives = 3;
let gameOn = false

// Paddle state
const paddle = {
  x: canvas.width / 2 - paddleWidth / 2,
  y: canvas.height - paddleHeight,
  width: paddleWidth,
  height: paddleHeight,
  dx: 0
};

// Ball state
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  dx: 6 * (Math.random() > 0.5 ? 1 : -1),
  dy: -6
};

// Bricks state
const bricks = [];
for (let row = 0; row < brickRowCount; row++) {
  bricks[row] = [];
  for (let col = 0; col < brickColumnCount; col++) {
    bricks[row][col] = { x: 0, y: 0, status: 1 };
  }
}

// Event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(e) {
	if (gameOn == false) {
		gameOn = true
		update()
	}
  if (e.key === 'd' || e.key === 'ArrowRight') {
    paddle.dx = paddleSpeed;
  } else if (e.key === 'a' || e.key === 'ArrowLeft') {
    paddle.dx = -paddleSpeed;
  }
}

function handleKeyUp(e) {
  if (e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'ArrowLeft') {
    paddle.dx = 0;
  }
}

// Update paddle position
function updatePaddle() {
  paddle.x += paddle.dx;

  // Keep the paddle within the canvas bounds
  if (paddle.x < 0) {
    paddle.x = 0;
  } else if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }
}

// Update ball position
function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Detect collision with the walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1; // Reverse the horizontal direction
  }

  if (ball.y - ball.radius < 0) {
    ball.dy *= -1; // Reverse the vertical direction
  }

  // Detect collision with the paddle
  if (
    ball.y + ball.radius > canvas.height - paddle.height &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    // Calculate the relative position of the ball on the paddle
    const ballPositionOnPaddle = ball.x - paddle.x;
    const paddleCenter = paddle.width / 2;

    // Adjust the direction based on the position on the paddle
    ball.dx = 3 * ((ballPositionOnPaddle - paddleCenter) / paddleCenter);
    ball.dy *= -1; // Reverse the vertical direction
  }

  // Detect collision with the bricks
  for (let row = 0; row < brickRowCount; row++) {
    for (let col = 0; col < brickColumnCount; col++) {
      const brick = bricks[row][col];
      if (brick.status === 1) {
        if (
          ball.x > brick.x &&
          ball.x < brick.x + brickWidth &&
          ball.y > brick.y &&
          ball.y < brick.y + brickHeight
        ) {
          brick.status = 0; // Brick is destroyed
          ball.dy *= -1; // Reverse the vertical direction
          score++;
          if (score === brickRowCount * brickColumnCount) {
            // Player wins if all bricks are destroyed
            alert('Congratulations! You win!');
            document.location.reload();
          }
        }
      }
    }
  }

  // Detect if the ball goes out of bounds
  if (ball.y + ball.radius > canvas.height) {
    lives--;
    if (lives === 0) {
      // Game over
      document.location.reload();
    } else {
      // Reset the ball position
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx = 6 * (Math.random() > 0.5 ? 1 : -1);
      ball.dy = -6;
    }
  }
}

// Update the canvas
function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img_bg, 0, 0)

  updatePaddle();
  updateBall();

  drawBricks();
  drawPaddle();
  drawBall();
  drawScore();
  drawLives();

  requestAnimationFrame(update);
}

// Draw the paddle
function drawPaddle() {
  context.beginPath();
  context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  context.fillStyle = '#EEEEEE';
  context.fill();
  context.closePath();
}

// Draw the ball
function drawBall() {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = '#EEEEEE';
  context.fill();
  context.closePath();
}

// Draw the bricks
function drawBricks() {
  for (let row = 0; row < brickRowCount; row++) {
    for (let col = 0; col < brickColumnCount; col++) {
      if (bricks[row][col].status === 1) {
        const brickX = col * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = row * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[row][col].x = brickX;
        bricks[row][col].y = brickY;
        context.beginPath();
        context.rect(brickX, brickY, brickWidth, brickHeight);
        context.fillStyle = '#EEEEEE';
        context.fill();
        context.closePath();
      }
    }
  }
}

// Draw the score
function drawScore() {
  context.font = '16px Arial';
  context.fillStyle = '#EEEEEE';
  context.fillText('Score: ' + score, 8, 20);
}

// Draw the remaining lives
function drawLives() {
  context.font = '16px Arial';
  context.fillStyle = '#EEEEEE';
  context.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

// Start the game
