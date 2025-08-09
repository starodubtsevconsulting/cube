// Cube drawing functionality
function drawCube() {
    if (!window.ctx) {
        console.error('Canvas context not found');
        return;
    }
    // domain specific language:
    // - vertices - array of points
    // - edges - array of lines (that connect vertices)
    // - faces - array of polygons (surfaces, rectangles in this case)

    // Cube has 8 vertices (dots, points)
    vertices = [
        // front
        // bottom
        { x: 0,   y: 0, z: 100 }, // bottom left
        { x: 100, y: 0, z: 100 }, // bottom right
        // top
        { x: 0,   y: 100, z: 100 }, // top left
        { x: 100, y: 100, z: 100 }, // top right

        // back
        // bottom
        { x: 0,   y: 0, z: 200 }, // bottom left
        { x: 100, y: 0, z: 200 }, // bottom right
        // top
        { x: 0,   y: 100, z: 200 }, // top left
        { x: 100, y: 100, z: 200 }, // top right
    ];

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
