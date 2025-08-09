// Circle drawing functionality
function drawCircle() {
    if (!window.ctx) {
        console.error('Canvas context not found');
        return;
    }
    
    window.ctx.beginPath();
    window.ctx.arc(400, 300, 150, 0, Math.PI * 2);
    window.ctx.fill();
    window.ctx.stroke();
}

document.addEventListener('DOMContentLoaded', () => {
    const drawCircleBtn = document.getElementById('drawCircle');
    if (drawCircleBtn) {
        drawCircleBtn.addEventListener('click', drawCircle);
    } else {
        console.error('Draw Circle button not found');
    }
});
