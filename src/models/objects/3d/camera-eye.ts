/// <reference path="../../../types.d.ts" />

import { Vertex3D } from '../../primitives/vertex-3d.js';
import { ScreenSpace } from './screen-space.js';

/**
 * Camera position and projection functionality for 3D rendering
 * 
 * DIFFERENCE BETWEEN CameraEye AND renderEyeView:
 * 
 * - CameraEye is a CLASS representing the "eye" or camera itself: its position in space,
 *   field of view, and the math for projecting 3D points to 2D. It handles the 
 *   transformation from world coordinates to normalized coordinates.
 * 
 * - renderEyeView is a FUNCTION that uses a CameraEye instance to render
 *   a complete World3D. This separation allows:
 *   1. Using the same camera to view multiple worlds
 *   2. Using multiple cameras to view the same world
 *   3. Decoupling camera projection from actual rendering logic
 */
export class CameraEye {
    /**
     * Camera position in world space.
     */
    position: Vertex3D = { x: 0, y: 0, z: 0 };

    /**
     * Screen space that this camera projects onto. (After all, camara can't see anything without a screen)
     */
    screen: ScreenSpace;

    /**
     * Vertical field of view in radians.
     * 60° is a common camera/game FOV (on 16:9 it's ≈ 90° horizontal).
     */
    fovY: number = (60 * Math.PI) / 180;
    
    /**
     * Near clipping plane distance.
     * Objects closer than this won't be rendered.
     */
    near: number = 0.1;
    
    /**
     * Far clipping plane distance.
     * Objects further than this won't be rendered.
     */
    far: number = 1e6;

    /**
     * Creates a new camera eye with a reference to the screen it projects onto.
     * 
     * @param screen The screen space that this camera projects onto
     */
    constructor(screen: ScreenSpace) {
        this.screen = screen;
    }

    /**
     * Projects a vertex from world space to normalized device coordinates.
     * Returns null if the vertex is outside the view frustum.
     * 
     * @param vertex The 3D vertex to project
     * @returns Normalized coordinates or null if not visible
     */
    projectNorm(vertex: Vertex3D): { x: number; y: number } | null {
        // Calculate aspect ratio from screen dimensions
        const aspect = this.screen.width / this.screen.height;
        
        // Translate to camera space (camera at origin)
        const cx = vertex.x - this.position.x;
        const cy = vertex.y - this.position.y;
        const cz = vertex.z - this.position.z;
        
        // Check if within clipping planes
        if (cz <= this.near || cz >= this.far) return null;
        
        // Calculate tangent of half the FOV
        const t = Math.tan(this.fovY / 2);
        
        // Project to normalized device coordinates
        const xn = (cx / (cz * t)) / aspect;
        const yn = cy / (cz * t);
        
        // Check for numerical errors
        if (!Number.isFinite(xn) || !Number.isFinite(yn)) return null;
        
        // Simple frustum clipping - check if point is within normalized range
        if (xn < -1 || xn > 1 || yn < -1 || yn > 1) return null;
        
        return { x: xn, y: yn };
    }
}
