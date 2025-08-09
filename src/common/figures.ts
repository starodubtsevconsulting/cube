import {Edge, Vertex3D} from '../types';

/**
 * Base class for all 3D figures
 */
export abstract class Figure3D {
    protected vertices: Vertex3D[] = [];
    protected edges: Edge[] = [];

    /**
     * Projects a 3D point to 2D screen coordinates
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
    public abstract draw(): void;

    /**
     * Gets the vertices of the figure
     */
    public getVertices(): Vertex3D[] {
        return [...this.vertices];
    }

    /**
     * Gets the center point of the figure
     */
    public getCenter(): Vertex3D {
        if (this.vertices.length === 0) {
            return { x: 0, y: 0, z: 0 };
        }
        
        const sum = this.vertices.reduce((acc, vertex) => ({
            x: acc.x + vertex.x,
            y: acc.y + vertex.y,
            z: acc.z + vertex.z
        }), { x: 0, y: 0, z: 0 });
        
        return {
            x: sum.x / this.vertices.length,
            y: sum.y / this.vertices.length,
            z: sum.z / this.vertices.length
        };
    }
}
