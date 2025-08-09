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

    // - handedness -  the orientation of our 3D coordinate system: for example: right-handed (classy)

    // Cube has 8 vertices (dots, points)
    // Defined in right-hand rule:

    // Right-hand rule: (see docs/napkin-notes.png)
    //    - Index = +X (to the right)
    //    - Middle = +Y (up)
    //    - Thumb = +Z (away from us, into the page)
    //  - The camera at the origin looking down the –Z axis sees objects in front.
    //  - A cube with z=100 is farther (deeper) away than one at z=50.

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

/**
 * We would need to project each vertex to the screen.
 * Since we have a 3D world, we need to project it to a 2D screen. * @param worldPoint
 *  @param {Object} worldPoint3D - The 3D point with {x, y, z} in world coordinates.
 *  @returns {Object} Screen coordinates {sx, sy}, in pixels.
 */
function projectToScreen(worldPoint3D) {

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
