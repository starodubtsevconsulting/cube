"use strict";
// Circle drawing functionality
function drawCircle() {
    if (!window.ctx) {
        console.error('Canvas context not found');
        return;
    }
    // Clear any existing drawings
    if (window.canvas) {
        window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
    }
    // Draw a circle
    window.ctx.beginPath();
    window.ctx.arc(400, 300, 150, 0, Math.PI * 2);
    window.ctx.fill();
    window.ctx.stroke();
    console.log('Circle drawn');
}
// Initialize circle drawing when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const drawCircleBtn = document.getElementById('drawCircle');
    if (drawCircleBtn) {
        drawCircleBtn.addEventListener('click', drawCircle);
        console.log('Circle button event listener added');
    }
    else {
        console.error('Draw Circle button not found');
    }
});
//# sourceMappingURL=circle.js.map