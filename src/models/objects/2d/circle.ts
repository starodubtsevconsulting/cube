/// <reference path="../../../types.d.ts" />

// Circle drawing functionality
export function drawCircle(): void {
    console.log('Drawing circle...');
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
    window.ctx.fillStyle = '#3498db';
    window.ctx.strokeStyle = '#000000';
    window.ctx.fill();
    window.ctx.stroke();

    console.log('Circle drawn successfully');
}

// Export this function to be accessible from global scope
export function initCircleDrawing(): void {
    console.log('Initializing circle drawing');
    const drawCircleBtn = document.getElementById('drawCircle');
    if (drawCircleBtn) {
        drawCircleBtn.addEventListener('click', drawCircle);
        console.log('Circle button listener attached');
    } else {
        console.error('Draw Circle button not found');
    }
}

// Make function available globally for HTML access
if (typeof window !== 'undefined') {
    (window as any).drawCircle = drawCircle;
    (window as any).initCircleDrawing = initCircleDrawing;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', (): void => {
    initCircleDrawing();
});
