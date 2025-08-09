import { Figure3D } from './common/figures';

class Cube extends Figure3D {


    constructor() {
        super();
        // Initialize cube vertices
        this.vertices = [
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

        // Defining the lines - the edges, which connect the vertices
        // so the 0, 1 means that 0's  is connected to 1's vertex
        // we have total of 12 edges (same as human has 12 limbs),
        // so not only human is close to banana, but also human is close to the cube).
        this.edges = [
            [0,1], [1,3], [3,2], [2,0], // front
            [4,5], [5,7], [7,6], [6,4], // back
            [0,4], [1,5], [2,6], [3,7]  // connect front and back
        ]
    }

    /**
     * Draws the cube on the canvas
     */
    public draw(): void {
        if (!window.ctx) {
            console.error('Canvas context not found');
            return;
        }

        console.log('Drawing cube...');
        
        // TODO: Add actual drawing logic here
        // For now, just log the vertices
        console.log('Cube vertices:', this.vertices);
    }


}

// Initialize cube drawing when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (): void => {
    const drawCubeBtn = document.getElementById('drawTheCube');
    if (drawCubeBtn) {
        console.log('Cube button found, adding event listener...');
        
        drawCubeBtn.addEventListener('click', () => {
            const cube = new Cube();
            cube.draw();
        });
    } else {
        console.error('Draw Cube button not found');
    }
});
