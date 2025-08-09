// Cube drawing functionality
document.addEventListener('DOMContentLoaded', () => {
    const drawCubeBtn = document.getElementById('drawTheCube');
    if (drawCubeBtn) {
        drawCubeBtn.addEventListener('click', () => {
            if (!window.ctx) {
                console.error('Canvas context not found');
                return;
            }
            console.log('cube will be there');
            // Cube drawing logic will go here
        });
    } else {
        console.error('Draw Cube button not found');
    }
});
