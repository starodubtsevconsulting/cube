// Line drawing functionality
export function drawLine(): void {
    console.log('Drawing line...');
    if (!window.ctx) {
        console.error('Canvas context not found');
        return;
    }

    window.ctx.beginPath();
    window.ctx.moveTo(100, 100);
    window.ctx.lineTo(700, 500);
    window.ctx.stroke();
    console.log('Line drawn successfully');
}

// Export this function to be accessible from global scope
export function initLineDrawing(): void {
    console.log('Initializing line drawing');
    const drawLineBtn = document.getElementById('drawLine');
    if (drawLineBtn) {
        drawLineBtn.addEventListener('click', drawLine);
        console.log('Line button listener attached');
    } else {
        console.error('Draw Line button not found');
    }
}

// Make function available globally for HTML access
if (typeof window !== 'undefined') {
    (window as any).drawLine = drawLine;
    (window as any).initLineDrawing = initLineDrawing;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', (): void => {
    initLineDrawing();
});
