/// <reference path="../../../types.d.ts" />
import {Edge, Vertex3D} from '../../../types';


export class CameraEye {
    /** Eye position in world space (fixed for now) */
    position: Vertex3D = { x: 0, y: 0, z: 0 };

    /** Vertical field of view in radians */
    fovY = (60 * Math.PI) / 180;

    /**
     * Projects a 3D point in world space to 2D screen space
     * Assumes camera at (0,0,0) looking toward +Z, no rotation yet.
     */
    projectToScreen(p: Vertex3D): { x: number; y: number } {
        // translate point into camera space (position fixed at origin)
        const cx = p.x - this.position.x;
        const cy = p.y - this.position.y;
        const cz = p.z - this.position.z;

        const t = Math.tan(this.fovY / 2);

        return {
            x: cx / (cz * t),
            y: cy / (cz * t)
        };
    }
}



export class WorldSpace {
    private figures: Figure3D[] = [];
    private camera: CameraEye;

    constructor(camera: CameraEye) {
        this.camera = camera;
    }

/* <<<<<<<<<<<<<<  ✨ Windsurf Command ⭐ >>>>>>>>>>>>>>>> */
    /**
     * Iterates over all figures in the world space and
     * asks each of them to draw themselves in the 2D screen space.
     * The camera object is passed as a parameter to each figure's draw() method.
     */
/* <<<<<<<<<<  c530253f-743a-4bed-a931-78f903e762b7  >>>>>>>>>>> */
    render(): void {
        for (const figure of this.figures) {
            figure.draw(this.camera);
        }
    }

    addFigure(figure: Figure3D): void {
        this.figures.push(figure);
    }
}


/**
 * Base class for all 3D figures
 */
export abstract class Figure3D {
    protected vertices: Vertex3D[] = [];
    protected edges: Edge[] = [];

    /**
     * Projects a 3D point to 2D screen coordinates
     * In fact, that is "the most important function",
     * as it reflects the reality for us to the way see it on the screen.
     * @param point - The 3D point in world coordinates
     * @returns Screen coordinates in pixels
     */
    protected projectToScreen(point: Vertex3D): { x: number; y: number } {
        // Simple orthographic projection by default
        return {
            x: point.x,
            y: point.y
        };
    }

    /**
     * Draws the figure on the canvas
     * Must be implemented by concrete figure classes
     * What it would do is actually to draw every edge
     *  (line by line, literally - "connected dots"
     *  - since that is how we draw - by lines, by edges)
     *  As we draw, we would also use the projectToScreen() function
     *   to place vertices correctly to the 2d world.
     */
    public draw(camera: CameraEye): void {
        console.log(`Drawing figure with ${this.edges.length} edges...`);

        for (const [a, b] of this.edges) {
            if (a >= this.vertices.length || b >= this.vertices.length) {
                console.error(`Edge [${a}, ${b}] references non-existent vertices (total vertices: ${this.vertices.length})`);
                continue;
            }

            const p1 = camera.projectToScreen(this.vertices[a]);
            const p2 = camera.projectToScreen(this.vertices[b]);

            console.log(`  Edge [${a},${b}]: (${p1.x},${p1.y}) to (${p2.x},${p2.y})`);

            window.ctx?.beginPath();
            window.ctx?.moveTo(p1.x, p1.y);
            window.ctx?.lineTo(p2.x, p2.y);
            window.ctx?.stroke();
        }
    }

    /**
     * Returns the vertices of the figure
     * @returns Array of 3D vertices
     */
    public getVertices(): Vertex3D[] {
        return [...this.vertices];
    }

}


export class Cube extends Figure3D {


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
     * Calculates the center of the figure
     * @returns The center point of the figure
     */
    public getCenter(): Vertex3D {
        if (this.vertices.length === 0) {
            return { x: 0, y: 0, z: 0 };
        }

        const sum = this.vertices.reduce(
            (acc, vertex) => ({
                x: acc.x + vertex.x,
                y: acc.y + vertex.y,
                z: acc.z + vertex.z,
            }),
            { x: 0, y: 0, z: 0 }
        );

        return {
            x: sum.x / this.vertices.length,
            y: sum.y / this.vertices.length,
            z: sum.z / this.vertices.length,
        };
    }


}

// Initialize cube drawing when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (): void => {
    const drawCubeBtn = document.getElementById('drawTheCube');
    if (drawCubeBtn) {
        console.log('Cube button found, adding event listener...');

        drawCubeBtn.addEventListener('click', () => {
            const camera = new CameraEye(); // defaults to (0,0,0)
            const world = new WorldSpace(camera);

            const cube = new Cube();
            world.addFigure(cube);

            world.render();
        });
    } else {
        console.error('Draw Cube button not found');
    }
});
