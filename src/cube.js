// Cube drawing functionality
function drawCube() {
    if (!window.ctx) {
        console.error('Canvas context not found');
        return;
    }

    console.log('Drawing cube...');
}

// Cube drawing functionality
document.addEventListener('DOMContentLoaded', () => {
    const drawCubeBtn = document.getElementById('drawTheCube');
    if (drawCubeBtn) {
        console.log('Cube button found, adding event listener...');
        drawCubeBtn.addEventListener('click', drawCube);
    } else {
        console.error('Draw Cube button not found');
    }
});
