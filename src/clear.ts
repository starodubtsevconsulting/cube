// Canvas clearing functionality
function clearCanvas(): void {
    if (!window.ctx || !window.canvas) {
        console.error('Canvas context or canvas element not found');
        return;
    }
    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
}

// Initialize canvas clearing when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (): void => {
    const clearCanvasBtn = document.getElementById('clearCanvas');
    if (clearCanvasBtn) {
        clearCanvasBtn.addEventListener('click', clearCanvas);
    } else {
        console.error('Clear Canvas button not found');
    }
});
