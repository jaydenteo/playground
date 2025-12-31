const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

// Settings
const carRows = 2;
const carCols = 4;
const paddleHeightRatio = 0.03;
const ballRadiusRatio = 0.02;
let cars = [];
let paddleWidth, paddleHeight, ballRadius, x, y, dx, dy, paddleX;
let animationId;
let gameRunning = false;

// Resize canvas dynamically
function resizeCanvas() {
  const width = canvas.parentElement.clientWidth;
  canvas.width = width;
  canvas.height = width; // square
  paddleWidth = canvas.width * 0.18;
  paddleHeight = canvas.height * paddleHeightRatio;
  ballRadius = canvas.width * ballRadiusRatio;
  dx = 2.5;
  dy = -2.5;
  resetPreview();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Initialize cars dynamically
function initCars() {
  cars = [];
  const totalWidth = canvas.width * 0.85;
  const carWidth = totalWidth / carCols - canvas.width * 0.03;
  const carHeight = canvas.height * 0.06;
  const padding = canvas.width * 0.03;
  const offsetX =
    (canvas.width - (carCols * carWidth + (carCols - 1) * padding)) / 2;

  for (let r = 0; r < carRows; r++) {
    for (let c = 0; c < carCols; c++) {
      const carX = offsetX + c * (carWidth + padding);
      const carY = 20 + r * (carHeight + padding);
      cars.push({
        x: carX,
        y: carY,
        width: carWidth,
        height: carHeight,
        status: 1,
        alpha: 1,
      });
    }
  }
}

// Reset preview
function resetPreview() {
  paddleX = (canvas.width - paddleWidth) / 2;
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2.5;
  dy = -2.5;
  initCars();
  startButton.style.display = "block";
  startButton.style.left =
    canvas.offsetLeft + canvas.width / 2 - startButton.offsetWidth / 2 + "px";
  startButton.style.top =
    canvas.offsetTop + canvas.height / 2 - startButton.offsetHeight / 2 + "px";
  gameRunning = false;
  drawPreview();
}

// Draw paddle
function drawPaddle() {
  ctx.fillStyle = "#000";
  ctx.fillRect(
    paddleX,
    canvas.height - paddleHeight - 10,
    paddleWidth,
    paddleHeight
  );
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.closePath();
}

// Draw cars with fading
function drawCars() {
  cars.forEach((car) => {
    if (car.status === 0 && car.alpha > 0) car.alpha -= 0.08;
    if (car.alpha <= 0) return;
    ctx.globalAlpha = car.alpha;
    ctx.fillStyle = "#000";
    ctx.fillRect(car.x, car.y + 5, car.width, car.height - 5);
    ctx.beginPath();
    ctx.moveTo(car.x + 5, car.y + 5);
    ctx.lineTo(car.x + car.width - 5, car.y + 5);
    ctx.lineTo(car.x + car.width - 10, car.y);
    ctx.lineTo(car.x + 10, car.y);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

// Collision detection
function collisionDetection() {
  cars.forEach((car) => {
    if (car.status) {
      if (
        x + ballRadius > car.x &&
        x - ballRadius < car.x + car.width &&
        y + ballRadius > car.y &&
        y - ballRadius < car.y + car.height
      ) {
        dy = -dy;
        car.status = 0;
      }
    }
  });
}

// Draw preview
function drawPreview() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCars();
  drawBall();
  drawPaddle();
}

// Game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCars();
  drawBall();
  drawPaddle();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius - paddleHeight - 10) {
    if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
    else {
      cancelAnimationFrame(animationId);
      resetPreview();
      return;
    }
  }

  x += dx;
  y += dy;

  if (cars.every((car) => car.alpha <= 0)) {
    cancelAnimationFrame(animationId);
    resetPreview();
    return;
  }

  animationId = requestAnimationFrame(draw);
}

// Mouse paddle
canvas.addEventListener("mousemove", (e) => {
  if (!gameRunning) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  paddleX = mouseX - paddleWidth / 2;
  if (paddleX < 0) paddleX = 0;
  if (paddleX + paddleWidth > canvas.width)
    paddleX = canvas.width - paddleWidth;
});

// Touch paddle for mobile
canvas.addEventListener(
  "touchmove",
  (e) => {
    if (!gameRunning) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    paddleX = touchX - paddleWidth / 2;
    if (paddleX < 0) paddleX = 0;
    if (paddleX + paddleWidth > canvas.width)
      paddleX = canvas.width - paddleWidth;
  },
  { passive: false }
);

// Start button
startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  gameRunning = true;
  draw();
});

// Initialize preview
resetPreview();
