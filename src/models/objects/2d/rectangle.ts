// Rectangle drawing functionality
function drawRectangle(): void {
    if (!window.ctx) {
        console.error('Canvas context not found');
        return;
    }
    
    window.ctx.fillRect(200, 200, 400, 200);
    window.ctx.strokeRect(200, 200, 400, 200);
}

// Initialize rectangle drawing when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (): void => {
    const drawRectBtn = document.getElementById('drawRect');
    if (drawRectBtn) {
        drawRectBtn.addEventListener('click', drawRectangle);
    } else {
        console.error('Draw Rectangle button not found');
    }
});
