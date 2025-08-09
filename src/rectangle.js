// Rectangle drawing functionality
function drawRectangle() {
    if (!window.ctx) {
        console.error('Canvas context not found');
        return;
    }
    
    window.ctx.fillRect(200, 200, 400, 200);
    window.ctx.strokeRect(200, 200, 400, 200);
}

document.addEventListener('DOMContentLoaded', () => {
    const drawRectBtn = document.getElementById('drawRect');
    if (drawRectBtn) {
        drawRectBtn.addEventListener('click', drawRectangle);
    } else {
        console.error('Draw Rectangle button not found');
    }
});
