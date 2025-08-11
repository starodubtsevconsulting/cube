/// <reference path="../../../types.d.ts" />

// Define Vertex3D interface directly in this file
interface Vertex3D {
    x: number;
    y: number;
    z: number;
}

/**
 * Camera position and projection functionality for 3D rendering
 */
export class CameraEye {
    /**
     * Camera position in world space.
     *
     * This is the reference point (origin) for all projection math.
     * In rendering pipelines, we always transform the world so that the
     * camera is effectively located at (0,0,0) before projecting.
     *
     * With this default value, the camera is fixed at the world origin,
     * facing down the +Z axis, making (0,0,0) the "center of the universe"
     * for the current view.
     *
     * In a game, this is the value we would update when the player or hero
     * moves, so the camera (eye) follows them and the scene is rendered
     * from their new position.
     */
    position: Vertex3D = { x: 0, y: 0, z: 0 };

    /**
     * Setting the vertical field of view 𝛼 α to 60° (converted to radians).
     * fovY = 60° is a common camera/game FOV (on 16:9 it's ≈ 90° horizontal).
     * 60° is a sane default. It feels natural on a 16:9 screen (≈90° horizontal), with low distortion and no "tunnel vision."
     * Human eye: 120-200° (for the record)
     * Bigger FOV ⇒ "zoom out."
     */
    fovY = (60 * Math.PI) / 180;

    /**
     * Projects a 3D world-space point into 2D normalized screen coordinates.
     *
     * This is the **core perspective projection math** step:
     *   - Input: world-space point (p) and the current viewport aspect ratio.
     *   - Output: normalized coordinates (xn, yn) where:
     *       (0,0) = screen center
     *       ±1 on Y = top/bottom edges of the virtual "1×1" screen
     *       ±1 on X = left/right edges (after aspect ratio correction)
     *
     * Steps:
     *   1. Translate the point so the camera position becomes the origin.
     *   2. Ignore points with z <= 0 (behind or at the camera).
     *   3. Apply perspective division:
     *        - Scale X and Y by distance from camera (cz) and by focal length factor.
     *        - Focal length factor is derived from vertical field of view:
     *            t = tan(fovY / 2)
     *        - Horizontal coordinate is divided by aspect ratio to keep proportions.
     *   4. Return normalized coordinates.
     *
     * These normalized coordinates are later mapped to pixel space
     * by ScreenSpace.toPixels().
     *
     * @param p 3D point in world space
     * @param aspect viewport aspect ratio (width / height)
     * @returns normalized 2D coordinates or null if point is behind camera
     */
    projectNorm(p: Vertex3D, aspect: number): { x: number; y: number } | null {
        const cx = p.x - this.position.x;
        const cy = p.y - this.position.y;
        const cz = p.z - this.position.z;

        // Behind or at the camera → no projection
        if (!(cz > 0)) return null;

        const t = Math.tan(this.fovY / 2); // focal length factor
        const xn = (cx / (cz * t)) / aspect; // normalized X
        const yn =  cy / (cz * t);           // normalized Y

        if (!Number.isFinite(xn) || !Number.isFinite(yn)) return null;
        return { x: xn, y: yn };
    }
}
