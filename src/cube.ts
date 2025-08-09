import { Figure3D } from './common/figures';
import { Point3D } from './types';

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
