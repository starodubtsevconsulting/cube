/// <reference path="../../../types.d.ts" />
import { Edge, Vertex3D } from '../../../types';

/* ---------- CameraEye ---------- */
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
     * fovY = 60° is a common camera/game FOV (on 16:9 it’s ≈ 90° horizontal).
     * 60° is a sane default. It feels natural on a 16:9 screen (≈90° horizontal), with low distortion and no “tunnel vision.”
     * Human eye: 120-200° (for the record)
     * Bigger FOV ⇒ “zoom out.”
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

/* ---------- ScreenSpace ---------- */
export class ScreenSpace {
    constructor(public width: number, public height: number, public zoom = 1) {}

    /**
     * Converts normalized screen coordinates (from CameraEye.projectNorm)
     * into actual pixel coordinates on the canvas.
     *
     * Projection pipeline:
     *   1. CameraEye.projectNorm(...) → 3D → 2D normalized coordinates:
     *        - (0,0) is screen center
     *        - ±1 on Y = top/bottom edges of the virtual "1×1" screen
     *        - aspect ratio already applied
     *   2. ScreenSpace.toPixels(...) → normalized → pixel coordinates:
     *        - Shift origin to canvas center
     *        - Scale to canvas height (apply zoom factor)
     *        - Flip Y so +Y is up in math space, down in pixel space
     *
     * @param n Normalized 2D coordinates from CameraEye.projectNorm
     * @returns Pixel coordinates ready for drawing on the canvas
     */
    toPixels(n: { x: number; y: number }) {
        const cx = this.width / 2, cy = this.height / 2;
        const s = (this.height / 2) * this.zoom;
        return { x: cx + n.x * s, y: cy - n.y * s };
    }

}

/* ---------- WorldSpace ---------- */
export class WorldSpace {
    private figures: Figure3D[] = [];
    constructor(private camera: CameraEye, private screen: ScreenSpace) {}

    addFigure(f: Figure3D) { this.figures.push(f); }

    render(): void {
        const aspect = this.screen.width / this.screen.height;
        const ctx = (window as any).ctx as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, this.screen.width, this.screen.height);
        for (const f of this.figures) f.draw(this.camera, this.screen, aspect);

        // draw overlay after figures
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Drag: rotate | Shift+drag: move | Wheel: zoom', 10, this.screen.height - 10);
    }
}

/* ---------- Figure3D ---------- */
export abstract class Figure3D {
    protected vertices: Vertex3D[] = [];
    protected edges: Edge[] = [];
    
    // Base properties that transformable figures should have
    protected base: Vertex3D[] = [];
    
    /**
     * The pivot point for rotation in model space (before translation).
     * Rotations (yaw/pitch) happen around this point.
     * This is typically the center of the object in model space.
     */
    protected center: Vertex3D = { x: 0, y: 0, z: 0 };
    
    /**
     * Rotation around the Y axis (yaw), in radians.
     * Positive yaw turns the object to the right, negative to the left.
     * Think "looking left/right."
     */
    protected yaw: number = 0;
    
    /**
     * Rotation around the X axis (pitch), in radians.
     * Positive pitch tilts the object upward, negative downward.
     * Think "looking up/down."
     */
    protected pitch: number = 0;
    
    /**
     * Translation offset applied after rotation, in world space.
     * This moves the object's position relative to the world origin.
     */
    protected position: Vertex3D = { x: 0, y: 0, z: 0 };

    /** Y-rotation of a single point around center */
    protected rotY(p: Vertex3D, c: Vertex3D, rad: number): Vertex3D {
        const x = p.x - c.x, z = p.z - c.z;
        const cs = Math.cos(rad), sn = Math.sin(rad);
        return { x: c.x + x*cs + z*sn, y: p.y, z: c.z - x*sn + z*cs };
    }

    /** X-rotation of a single point around center */
    protected rotX(p: Vertex3D, c: Vertex3D, rad: number): Vertex3D {
        const y = p.y - c.y, z = p.z - c.z;
        const cs = Math.cos(rad), sn = Math.sin(rad);
        return { x: p.x, y: c.y + y*cs - z*sn, z: c.z + y*sn + z*cs };
    }

    /**
     * Apply yaw (Y-axis) and pitch (X-axis) rotations to a base mesh,
     * then translate it into world space by a given position offset.
     *
     * Important:
     * - This transformation is **absolute**, not incremental.
     *   It always starts from the original `base` vertices (unrotated, untranslated).
     *   Rotation is applied relative to the given `center` point in model space.
     * - This avoids cumulative floating-point errors and "drift"
     *   that can happen if you keep rotating already-rotated vertices.
     *
     * Steps:
     *  1. Rotate the base vertices around the Y axis (`yaw`) relative to `center`.
     *  2. Rotate the result around the X axis (`pitch`) relative to `center`.
     *  3. Translate the rotated vertices by `pos` to place them in world space.
     *
     * @param base   Array of original (untransformed) vertices.
     * @param center Model-space pivot point for rotation (e.g., object center).
     * @param yaw    Rotation around Y axis (in radians).
     * @param pitch  Rotation around X axis (in radians).
     * @param pos    World-space position offset to move the object.
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
            this.rotX( // pitch
                this.rotY(v, center, yaw), // yaw
                center,
                pitch
            )
        );

        // Translate into world space by adding `pos` offset
        this.vertices = rotated.map(v => ({
            x: v.x + pos.x,
            y: v.y + pos.y,
            z: v.z + pos.z
        }));
    }

    /**
     * Updates the transform by applying rotation and translation.
     * Subclasses should call this after modifying position, yaw, or pitch.
     */
    public updateTransform(): void {
        this.applyTransform(
            this.base,
            this.center,
            this.yaw,
            this.pitch,
            this.position
        );
    }

    public draw(camera: CameraEye, screen: ScreenSpace, aspect: number): void {
        for (const [a, b] of this.edges) {
            if (a >= this.vertices.length || b >= this.vertices.length) continue;
            const n1 = camera.projectNorm(this.vertices[a], aspect);
            const n2 = camera.projectNorm(this.vertices[b], aspect);
            if (!n1 || !n2) continue;
            const p1 = screen.toPixels(n1);
            const p2 = screen.toPixels(n2);
            (window as any).ctx?.beginPath();
            (window as any).ctx?.moveTo(p1.x, p1.y);
            (window as any).ctx?.lineTo(p2.x, p2.y);
            (window as any).ctx?.stroke();
        }
    }
}

/* ---------- Cube (rotatable and movable) ---------- */
export class Cube extends Figure3D {
    // Override the base properties with Cube-specific values
    public center: Vertex3D = { x: 0, y: 0, z: 400 };
    public yaw = 0;
    public pitch = 0;
    public position = { x: 0, y: 0, z: 0 };

    constructor() {
        super();
        const CUBE_EDGE_LENGTH = 120;      // world units per cube edge
        const CUBE_HALF_EDGE = CUBE_EDGE_LENGTH / 2; // half edge, for centering
        const CUBE_CENTER_Z = 400;         // depth from camera (Z axis) where cube sits
        
        this.base = [
            { x: -CUBE_HALF_EDGE, y: -CUBE_HALF_EDGE, z: CUBE_CENTER_Z - CUBE_HALF_EDGE }, 
            { x:  CUBE_HALF_EDGE, y: -CUBE_HALF_EDGE, z: CUBE_CENTER_Z - CUBE_HALF_EDGE },
            { x: -CUBE_HALF_EDGE, y:  CUBE_HALF_EDGE, z: CUBE_CENTER_Z - CUBE_HALF_EDGE }, 
            { x:  CUBE_HALF_EDGE, y:  CUBE_HALF_EDGE, z: CUBE_CENTER_Z - CUBE_HALF_EDGE },
            { x: -CUBE_HALF_EDGE, y: -CUBE_HALF_EDGE, z: CUBE_CENTER_Z + CUBE_HALF_EDGE }, 
            { x:  CUBE_HALF_EDGE, y: -CUBE_HALF_EDGE, z: CUBE_CENTER_Z + CUBE_HALF_EDGE },
            { x: -CUBE_HALF_EDGE, y:  CUBE_HALF_EDGE, z: CUBE_CENTER_Z + CUBE_HALF_EDGE }, 
            { x:  CUBE_HALF_EDGE, y:  CUBE_HALF_EDGE, z: CUBE_CENTER_Z + CUBE_HALF_EDGE },
        ];
        this.edges = [
            [0,1], [1,3], [3,2], [2,0],
            [4,5], [5,7], [7,6], [6,4],
            [0,4], [1,5], [2,6], [3,7]
        ];
        this.updateTransform();
    }

    // Move the cube by the specified amount
    move(dx: number, dy: number, dz = 0) {
        this.position.x += dx;
        this.position.y += dy;
        this.position.z += dz;
        this.updateTransform();
    }
}

/* ---------- Function to draw the cube ---------- */
export function drawTheCube() {
    console.log('Draw Cube function called');
    const canvas = (window as any).canvas as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    const ctx = (window as any).ctx as CanvasRenderingContext2D;
    if (!ctx) {
        console.error('Canvas context not found');
        return;
    }
    
    const screen = new ScreenSpace(canvas.width, canvas.height, 1); // zoom 1x
    const camera = new CameraEye();

    const world = new WorldSpace(camera, screen);
    const cube = new Cube();

    world.addFigure(cube);
    world.render();

    console.log('Cube drawn and ready for interaction');

    // drag to rotate or move
    let dragging = false, lastX = 0, lastY = 0;
    const yawSpeed = 0.01, pitchSpeed = 0.01;
    const moveSpeed = 1; // Reduced for finer control

    canvas.addEventListener('pointerdown', e => {
        dragging = true; 
        lastX = e.clientX; 
        lastY = e.clientY;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    });
    
    canvas.addEventListener('pointerup', () => { dragging = false; });
    canvas.addEventListener('pointerleave', () => { dragging = false; });
    
    canvas.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX; 
        lastY = e.clientY;
        
        if (e.shiftKey) {
            // Move the cube when Shift key is pressed
            cube.move(dx * moveSpeed, -dy * moveSpeed); // Invert Y for natural movement
        } else {
            // Rotate the cube when no modifier key is pressed
            cube.yaw += dx * yawSpeed;
            cube.pitch += dy * pitchSpeed;
            cube.updateTransform();
        }
        
        world.render();
    });

    // wheel to zoom (scale screen)
    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        screen.zoom = Math.max(0.2, Math.min(5, screen.zoom * factor));
        world.render();
    }, { passive: false });
    
    // Display a simple message on the canvas to show controls
    // Removed this line as it's now handled in WorldSpace.render
    // ctx.font = '12px Arial';
    // ctx.fillStyle = 'black';
    // ctx.fillText('Drag: rotate | Shift+drag: move | Wheel: zoom', 10, canvas.height - 10);
}

/* ---------- Initialize event listener ---------- */
export function initCubeDrawing() {
    console.log('Initializing cube drawing');
    const btn = document.getElementById('drawTheCube');
    if (btn) {
        btn.addEventListener('click', drawTheCube);
        console.log('Draw cube button listener added');
    } else {
        console.error('Draw cube button not found');
    }
}

// Make functions globally available
if (typeof window !== 'undefined') {
    (window as any).drawTheCube = drawTheCube;
    (window as any).initCubeDrawing = initCubeDrawing;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCubeDrawing();
});
