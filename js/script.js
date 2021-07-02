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
ctx.strokeStyle = 'red';

canvas.addEventListener('mousedown', down, false);
canvas.addEventListener('mousemove', move, false);
canvas.addEventListener('mouseup', up, false);
canvas.addEventListener('mouseout', up, false);
canvas.addEventListener('touchstart', down, false);
canvas.addEventListener('touchmove', move, false);
canvas.addEventListener('touchend', up, false);

deleteButton.addEventListener('click', clearCanvas);

function down(e) {
    isDown = true;
    const { x, y } = getPos(e);
    points.push({ x, y });
    beginPoint = { x, y };
}

function move(e) {
    if (!isDown) return;

    const { x, y } = getPos(e);
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
    const { x, y } = getPos(e);
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

function getPos(e) {
    if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend') {
        return {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        }
    }
    return {
        x: e.clientX,
        y: e.clientY
    }
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
