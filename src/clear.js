// Canvas clearing functionality
function clearCanvas() {
    if (!window.ctx || !window.canvas) {
        console.error('Canvas context or canvas element not found');
        return;
    }
    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
}

document.addEventListener('DOMContentLoaded', () => {
    const clearCanvasBtn = document.getElementById('clearCanvas');
    if (clearCanvasBtn) {
        clearCanvasBtn.addEventListener('click', clearCanvas);
    } else {
        console.error('Clear Canvas button not found');
    }
});
