// Get canvas and context
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Set line style
ctx.lineWidth = 2;
ctx.strokeStyle = '#000000';
ctx.fillStyle = '#3498db';

// Drawing functions
function drawLine() {
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(700, 500);
    ctx.stroke();
}

function drawRectangle() {
    ctx.fillRect(200, 200, 400, 200);
    ctx.strokeRect(200, 200, 400, 200);
}

function drawCircle() {
    ctx.beginPath();
    ctx.arc(400, 300, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('drawLine').addEventListener('click', drawLine);
    document.getElementById('drawRect').addEventListener('click', drawRectangle);
    document.getElementById('drawCircle').addEventListener('click', drawCircle);
    document.getElementById('clearCanvas').addEventListener('click', clearCanvas);
    
    // Initial drawing
    drawLine();
    drawRectangle();
    drawCircle();
});

// Interactive drawing
let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);