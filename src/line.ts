// Line drawing functionality
function drawLine(): void {
    if (!window.ctx) {
        console.error('Canvas context not found');
        return;
    }
    
    window.ctx.beginPath();
    window.ctx.moveTo(100, 100);
    window.ctx.lineTo(700, 500);
    window.ctx.stroke();
}

// Initialize line drawing when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (): void => {
    const drawLineBtn = document.getElementById('drawLine');
    if (drawLineBtn) {
        drawLineBtn.addEventListener('click', drawLine);
    } else {
        console.error('Draw Line button not found');
    }
});
