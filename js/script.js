let isDown = false;
let points = [];
let beginPoint = null;

const canvas = document.getElementById('canvas');
const deleteButton = document.getElementById('deleteButton');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

ctx.lineWidth = 4;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = '#0780ff';


canvas.addEventListener('pointerdown', down);
canvas.addEventListener('pointermove', move);
canvas.addEventListener('pointerup', up);

deleteButton.addEventListener('click', clearCanvas);

function down(event) {
    isDown = true;
    const x = event.x;
    const y = event.y
    points.push({ x, y });
    beginPoint = { x, y };

    console.log(event);
    log(event.pointerType)
}

function move(event) {
    if (!isDown) return;

    const x = event.x;
    const y = event.y

    points.push({ x, y });

    if (points.length > 3) {
        const lastTwoPoints = points.slice(-2);
        const controlPoint = lastTwoPoints[0];
        const endPoint = {
            x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
            y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
        }
        drawLine(beginPoint, controlPoint, endPoint);
        beginPoint = endPoint;
    }
}

function up(e) {
    if (!isDown) return;
    const x = event.x;
    const y = event.y
    points.push({ x, y });
    if (points.length > 3) {
        const lastTwoPoints = points.slice(-2);
        const controlPoint = lastTwoPoints[0];
        const endPoint = lastTwoPoints[1];
        drawLine(beginPoint, controlPoint, endPoint);
    }
    beginPoint = null;
    isDown = false;
    points = [];
}

function drawLine(beginPoint, controlPoint, endPoint) {
    ctx.beginPath();
    ctx.moveTo(beginPoint.x, beginPoint.y);
    ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
    ctx.stroke();
    ctx.closePath();
}

function clearCanvas() {
    isDown = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.length = 0;
}

function log(msg) {
    const logElement = document.querySelector('.log');
    logElement.innerHTML = `${logElement.innerHTML}\n<p>${msg}</p>`;
    logElement.scroll(0, 1000);
}
