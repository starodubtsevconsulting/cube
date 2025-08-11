/// <reference path="../../../types.d.ts" />

import { Figure3D } from './figure-3d.js';
import { CameraEye } from './camera-eye.js';
import { ScreenSpace } from './screen-space.js';

/**
 * A 3D cube implementation with rotation and movement support
 */
export class Cube extends Figure3D {
    /**
     * Constructor for creating a new Cube
     * 
     * @param size The size of the cube (edge length)
     * @param x Initial x position
     * @param y Initial y position
     * @param z Initial z position
     */
    constructor(size: number, x = 0, y = 0, z = 0) {
        super();
        
        // Initialize with custom position
        this.position = { x, y, z };
        
        // Define the center of the cube for rotation
        this.center = { x: 0, y: 0, z: 0 };
        
        // Default rotations
        this.yaw = Math.PI / 4;    // 45 degrees
        this.pitch = -Math.PI / 6; // -30 degrees

        // Half the size for +/- from center
        const s = size / 2;
        
        // Define the 8 vertices of a cube centered at the origin
        this.base = [
            // Front face (z = +s)
            { x: -s, y: -s, z: +s }, // 0: bottom-left-front
            { x: +s, y: -s, z: +s }, // 1: bottom-right-front
            { x: +s, y: +s, z: +s }, // 2: top-right-front
            { x: -s, y: +s, z: +s }, // 3: top-left-front
            
            // Back face (z = -s)
            { x: -s, y: -s, z: -s }, // 4: bottom-left-back
            { x: +s, y: -s, z: -s }, // 5: bottom-right-back
            { x: +s, y: +s, z: -s }, // 6: top-right-back
            { x: -s, y: +s, z: -s }  // 7: top-left-back
        ];

        // Define the edge connectivity
        this.edges = [
            // Front face
            [0, 1], [1, 2], [2, 3], [3, 0],
            // Back face
            [4, 5], [5, 6], [6, 7], [7, 4],
            // Connecting edges
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];
        
        // Apply initial transformation
        this.updateTransform();
    }

    /** Edge connectivity (pairs of vertex indices) */
    edges: number[][] = [];

    /**
     * Moves the cube by the given deltas
     * 
     * @param dx Change in x position
     * @param dy Change in y position
     * @param dz Change in z position (default: 0)
     */
    move(dx: number, dy: number, dz = 0) {
        this.position.x += dx;
        this.position.y += dy;
        this.position.z += dz;
        this.updateTransform();
    }

    /**
     * Rotates the cube by the given angles
     * 
     * @param dYaw Change in yaw angle (Y-axis rotation)
     * @param dPitch Change in pitch angle (X-axis rotation)
     */
    rotate(dYaw: number, dPitch: number) {
        this.yaw += dYaw;
        this.pitch += dPitch;
        this.updateTransform();
    }

    /**
     * Draws the cube on the given canvas context
     * 
     * @param ctx Canvas rendering context
     * @param camera Camera/eye for perspective projection
     * @param screen Screen space converter
     */
    draw(
        ctx: CanvasRenderingContext2D,
        camera: CameraEye,
        screen: ScreenSpace
    ): void {
        // Calculate aspect ratio
        const aspect = screen.width / screen.height;
        
        // Project 3D points to 2D screen space
        const points2D = this.vertices.map(v => {
            const p = camera.projectNorm(v, aspect);
            return p ? screen.toPixels(p) : null;
        });
        
        // Draw the edges of the cube
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 128, 255, 0.8)';
        ctx.lineWidth = 2;
        
        for (const [from, to] of this.edges) {
            const p1 = points2D[from];
            const p2 = points2D[to];
            
            // Only draw if both points are visible
            if (p1 && p2) {
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
            }
        }
        
        ctx.stroke();

        // Draw vertices as small circles
        ctx.fillStyle = 'rgba(255, 0, 128, 0.8)';
        
        for (const p of points2D) {
            if (p) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}
