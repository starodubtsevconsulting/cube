// Canvas clearing functionality
export function clearCanvas(): void {
    console.log('Clearing canvas...');
    if (!window.ctx || !window.canvas) {
        console.error('Canvas context or canvas element not found');
        return;
    }
    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);
    console.log('Canvas cleared successfully');
}

// Export this function to be accessible from global scope
export function initClearCanvas(): void {
    console.log('Initializing canvas clearing');
    const clearCanvasBtn = document.getElementById('clearCanvas');
    if (clearCanvasBtn) {
        clearCanvasBtn.addEventListener('click', clearCanvas);
        console.log('Clear button listener attached');
    } else {
        console.error('Clear Canvas button not found');
    }
}

// Make function available globally for HTML access
if (typeof window !== 'undefined') {
    (window as any).clearCanvas = clearCanvas;
    (window as any).initClearCanvas = initClearCanvas;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', (): void => {
    initClearCanvas();
});
