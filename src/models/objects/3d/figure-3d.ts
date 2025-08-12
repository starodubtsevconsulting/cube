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
    /** Vertices after transformation (current state) */
    vertices: Vertex3D[] = [];

    /** Reference vertices (initial model state) */
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

    /** Edge connectivity (pairs of vertex indices) */
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
