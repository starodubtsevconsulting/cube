/// <reference path="../../../types.d.ts" />

import { Vertex3D } from '../../primitives/vertex-3d.js';
import { WorldSpace } from './world-space.js';

/**
 * Base class for 3D figures
 * 
 * Note: This class has no knowledge of rendering or projection.
 * It only manages geometry data and transformations.
 */
export abstract class Figure3D {
    /**
     * Vertices after all transformations have been applied (current state).
     * These are the actual vertices used for rendering.
     * This array is updated whenever transformations change.
     */
    public vertices: Vertex3D[] = [];

    /**
     * Reference vertices that maintain the initial model state.
     * We keep these separate from the transformed vertices for several important reasons:
     * 
     * 1. Prevents accumulation of floating-point errors that would occur 
     *    if we repeatedly transformed already-transformed vertices
     * 
     * 2. Allows transformations to always be applied relative to a consistent 
     *    initial state rather than the previous transformation state
     * 
     * 3. Makes it possible to reset to the original state at any time
     * 
     * 4. Supports cleaner transformation chaining (applying multiple transformations 
     *    at once rather than sequentially)
     * 
     * 5. Common pattern in 3D graphics - separate model data from transformation state
     */
    protected base: Vertex3D[] = [];

    /** Center point for rotation */
    protected center: Vertex3D = { x: 0, y: 0, z: 0 };

    /**
     * Current yaw rotation angle in radians.
     * Rotation around Y axis (left/right).
     */
    protected yaw: number = 0;

    /**
     * Current pitch rotation angle in radians.
     * Rotation around X axis (up/down).
     */
    protected pitch: number = 0;

    /**
     * Current position in 3D space.
     */
    protected position: Vertex3D = { x: 0, y: 0, z: 0 };

    /**
     * Edge connectivity defined as pairs of vertex indices.
     * For example, [0,1] means "draw a line from vertex 0 to vertex 1".
     * 
     * Note: This property was moved from concrete classes (like Cube) to the
     * Figure3D base class during refactoring to support generic rendering.
     * Each subclass must define its specific edges in its constructor.
     * 
     * This allows the rendering system to draw any figure without
     * knowing its specific geometry details.
     */
    public edges: number[][] = [];

    /**
     * Updates the transformed vertices based on current rotation and position
     */
    protected updateTransform(): void {
        this.applyTransform(
            this.base,
            this.center,
            this.yaw,
            this.pitch,
            this.position
        );
    }

    /**
     * Applies rotation and translation transforms to the base vertices
     */
    protected applyTransform(
        base: Vertex3D[],
        center: Vertex3D,
        yaw: number,
        pitch: number,
        pos: Vertex3D
    ): void {
        // Rotate each vertex: first Y-axis (yaw), then X-axis (pitch)
        const rotated = base.map(v =>
            this.rotX(
                this.rotY(v, center, yaw),
                center,
                pitch
            )
        );
        // Translate into world space
        this.vertices = rotated.map(v => ({
            x: v.x + pos.x,
            y: v.y + pos.y,
            z: v.z + pos.z
        }));
    }

    /**
     * Rotates a vertex around the Y axis
     */
    protected rotY(v: Vertex3D, c: Vertex3D, angle: number): Vertex3D {
        return WorldSpace.rotateY(v, c, angle);
    }

    /**
     * Rotates a vertex around the X axis
     */
    protected rotX(v: Vertex3D, c: Vertex3D, angle: number): Vertex3D {
        return WorldSpace.rotateX(v, c, angle);
    }
}
