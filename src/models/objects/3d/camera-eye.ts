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
     * Camera orientation in radians (yaw and pitch).
     * - yaw: rotation around Y axis (left/right)
     * - pitch: rotation around X axis (up/down)
     */
    orientation: { yaw: number; pitch: number } = { yaw: 0, pitch: 0 };

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
     * Using the projection formula:
     * Xp = X / (Z * tan(α/2))
     * Yp = Y / (Z * tan(α/2))
     * 
     * Where:
     * - X, Y, Z are coordinates relative to camera position
     * - α is the field of view angle
     * - Xp, Yp are the projected normalized coordinates
     * 
     * @param vertex The 3D vertex to project
     * @returns Normalized coordinates with Z distance or null if not visible
     */
    projectNorm(vertex: Vertex3D): { x: number; y: number; distance: number } | null {
        // Calculate camera-space coordinates (camera at origin)
        // These are the X, Y, Z in our formula
        const X = vertex.x - this.position.x;
        const Y = vertex.y - this.position.y;
        const Z = vertex.z - this.position.z;

        // Apply camera orientation (yaw rotation around Y axis)
        // This transforms world coordinates to camera-relative coordinates
        const cosYaw = Math.cos(this.orientation.yaw);
        const sinYaw = Math.sin(this.orientation.yaw);
        
        // Rotate the point around the Y axis (yaw)
        const rotatedX = X * cosYaw + Z * sinYaw;
        const rotatedZ = Z * cosYaw - X * sinYaw;
        
        // Check if within clipping planes
        if (rotatedZ <= this.near || rotatedZ >= this.far) return null;
        
        // Calculate tan(α/2) where α is the field of view
        const tanHalfFov = Math.tan(this.fovY / 2);
        
        // Apply the projection formula:
        // Xp = X / (Z * tan(α/2))
        // Yp = Y / (Z * tan(α/2))
        const Xp = rotatedX / (rotatedZ * tanHalfFov);
        const Yp = Y / (rotatedZ * tanHalfFov);
        
        // Adjust X for aspect ratio (not part of the core formula, but needed for rectangular viewports)
        const aspect = this.screen.width / this.screen.height;
        const Xp_adjusted = Xp / aspect;
        
        // Check for numerical errors
        if (!Number.isFinite(Xp_adjusted) || !Number.isFinite(Yp)) return null;
        
        // Simple frustum clipping - check if point is within normalized range
        if (Xp_adjusted < -1 || Xp_adjusted > 1 || Yp < -1 || Yp > 1) return null;
        
        return { x: Xp_adjusted, y: Yp, distance: rotatedZ };
    }

    /**
     * Rotates the camera left/right (around Y axis)
     * @param angleRadians Amount to rotate in radians
     */
    rotateYaw(angleRadians: number): void {
        this.orientation.yaw += angleRadians;
        // Normalize between 0 and 2π
        this.orientation.yaw = this.orientation.yaw % (2 * Math.PI);
    }

    /**
     * Rotates the camera up/down (around X axis)
     * @param angleRadians Amount to rotate in radians
     */
    rotatePitch(angleRadians: number): void {
        this.orientation.pitch += angleRadians;
        // Clamp to avoid over-rotation (looking upside down)
        const maxPitch = Math.PI / 2 - 0.01; // Just slightly less than 90°
        this.orientation.pitch = Math.max(Math.min(this.orientation.pitch, maxPitch), -maxPitch);
    }

    /**
     * Moves camera forward in the direction it's facing
     * @param distance Distance to move forward
     */
    moveForward(distance: number): void {
        // Calculate direction vector based on yaw
        // Need to negate the angle for consistency with the projection matrix
        const dirX = Math.sin(-this.orientation.yaw);
        const dirZ = Math.cos(-this.orientation.yaw);
        
        // Update position
        this.position.x += dirX * distance;
        this.position.z += dirZ * distance;
    }

    /**
     * Moves camera left/right perpendicular to the direction it's facing
     * @param distance Distance to move (positive = right, negative = left)
     */
    moveSideways(distance: number): void {
        // Calculate direction vector based on yaw + 90 degrees
        // Need to negate the angle for consistency with the projection matrix
        const dirX = Math.sin(-(this.orientation.yaw + Math.PI / 2));
        const dirZ = Math.cos(-(this.orientation.yaw + Math.PI / 2));
        
        // Update position
        this.position.x += dirX * distance;
        this.position.z += dirZ * distance;
    }
}
