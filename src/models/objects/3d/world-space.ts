/// <reference path="../../../types.d.ts" />

// Define Vertex3D interface directly in this file
interface Vertex3D {
    x: number;
    y: number;
    z: number;
}

/**
 * World space utilities for 3D transformations
 */
export class WorldSpace {
    /**
     * Rotates a point around the Y axis (yaw rotation)
     *
     * @param p Point to rotate
     * @param c Center of rotation
     * @param angle Angle in radians
     * @returns Rotated point
     */
    static rotateY(p: Vertex3D, c: Vertex3D, angle: number): Vertex3D {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // Translate point to origin
        const tx = p.x - c.x;
        const tz = p.z - c.z;

        // Rotate point around Y axis
        const rx = tx * cos - tz * sin;
        const rz = tx * sin + tz * cos;

        // Translate back
        return {
            x: rx + c.x,
            y: p.y,
            z: rz + c.z
        };
    }

    /**
     * Rotates a point around the X axis (pitch rotation)
     *
     * @param p Point to rotate
     * @param c Center of rotation
     * @param angle Angle in radians
     * @returns Rotated point
     */
    static rotateX(p: Vertex3D, c: Vertex3D, angle: number): Vertex3D {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        // Translate point to origin
        const ty = p.y - c.y;
        const tz = p.z - c.z;

        // Rotate point around X axis
        const ry = ty * cos - tz * sin;
        const rz = ty * sin + tz * cos;

        // Translate back
        return {
            x: p.x,
            y: ry + c.y,
            z: rz + c.z
        };
    }
}
