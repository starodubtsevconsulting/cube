/// <reference path="../../../types.d.ts" />

// Rectangle drawing functionality
export function drawRectangle(): void {
    console.log('Drawing rectangle...');
    if (!window.ctx) {
        console.error('Canvas context not found');
        return;
    }

    window.ctx.fillStyle = '#3498db';
    window.ctx.strokeStyle = '#000000';
    window.ctx.fillRect(200, 200, 400, 200);
    window.ctx.strokeRect(200, 200, 400, 200);
    console.log('Rectangle drawn successfully');
}

// Export this function to be accessible from global scope
export function initRectangleDrawing(): void {
    console.log('Initializing rectangle drawing');
    const drawRectBtn = document.getElementById('drawRect');
    if (drawRectBtn) {
        drawRectBtn.addEventListener('click', drawRectangle);
        console.log('Rectangle button listener attached');
    } else {
        console.error('Draw Rectangle button not found');
    }
}

// Make function available globally for HTML access
if (typeof window !== 'undefined') {
    (window as any).drawRectangle = drawRectangle;
    (window as any).initRectangleDrawing = initRectangleDrawing;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', (): void => {
    initRectangleDrawing();
});
