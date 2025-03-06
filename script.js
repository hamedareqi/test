const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ضبط حجم الكانفاس ديناميكيًا
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientWidth * (4 / 3);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// المتغيرات الأساسية
let paddleWidth = canvas.width * 0.25;
let paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// إعدادات الكرة
let ballRadius = 7;
let ballX = canvas.width / 2;
let ballY = canvas.height - 50;
let ballSpeedX = 3;
let ballSpeedY = -3;

// إعدادات الطوب
let brickRowCount = 5;
let brickColumnCount = 7;
let brickWidth = canvas.width / brickColumnCount - 5;
let brickHeight = 20;
let brickPadding = 5;
let brickOffsetTop = 30;
let brickOffsetLeft = 10;

// إنشاء الطوب
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// رسم المضرب
function drawPaddle() {
    ctx.fillStyle = "white";
    ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
}

// رسم الكرة
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

// رسم الطوب
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.fillStyle = "red";
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

// كشف التصادم مع الطوب
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (ballX > b.x && ballX < b.x + brickWidth &&
                    ballY > b.y && ballY < b.y + brickHeight) {
                    ballSpeedY = -ballSpeedY;
                    b.status = 0;
                }
            }
        }
    }
}

// تحديث اللعبة
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    // حركة الكرة
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // تصادم الكرة مع الجدران
    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballRadius > canvas.height) {
        ballX = canvas.width / 2;
        ballY = canvas.height - 50;
        ballSpeedX = 3;
        ballSpeedY = -3;
    }

    // تصادم الكرة مع المضرب
    if (ballY + ballRadius > canvas.height - paddleHeight - 10 &&
        ballX > paddleX && ballX < paddleX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
    }

    // حركة المضرب
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 5;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 5;
    }

    requestAnimationFrame(updateGame);
}

// التحكم عبر لوحة المفاتيح
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") rightPressed = true;
    else if (e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") rightPressed = false;
    else if (e.key === "ArrowLeft") leftPressed = false;
});

// التحكم عبر اللمس
canvas.addEventListener("touchstart", (e) => {
    let touchX = e.touches[0].clientX;
    if (touchX < canvas.width / 2) {
        leftPressed = true;
    } else {
        rightPressed = true;
    }
});
canvas.addEventListener("touchend", () => {
    leftPressed = false;
    rightPressed = false;
});

// بدء اللعبة
updateGame();
