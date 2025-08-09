import {Edge, Vertex3D} from './types';

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
    public draw(): void {
        console.log(`Drawing figure with ${this.edges.length} edges...`);

        for (const [a, b] of this.edges) {
            if (a >= this.vertices.length || b >= this.vertices.length) {
                console.error(`Edge [${a}, ${b}] references non-existent vertices (total vertices: ${this.vertices.length})`);
                continue;
            }

            const p1 = this.projectToScreen(this.vertices[a]);
            const p2 = this.projectToScreen(this.vertices[b]);

            console.log(`  Edge [${a},${b}]: (${p1.x},${p1.y}) to (${p2.x},${p2.y})`);

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
