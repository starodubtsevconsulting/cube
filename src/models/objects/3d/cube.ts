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

/* ---------- helpers ---------- */
function rotY(p: Vertex3D, c: Vertex3D, rad: number): Vertex3D {
    const x = p.x - c.x, z = p.z - c.z;
    const cs = Math.cos(rad), sn = Math.sin(rad);
    return { x: c.x + x*cs + z*sn, y: p.y, z: c.z - x*sn + z*cs };
}
function rotX(p: Vertex3D, c: Vertex3D, rad: number): Vertex3D {
    const y = p.y - c.y, z = p.z - c.z;
    const cs = Math.cos(rad), sn = Math.sin(rad);
    return { x: p.x, y: c.y + y*cs - z*sn, z: c.z + y*sn + z*cs };
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
    }
}

/* ---------- Figure3D ---------- */
export abstract class Figure3D {
    protected vertices: Vertex3D[] = [];
    protected edges: Edge[] = [];
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
    private base: Vertex3D[];
    public center: Vertex3D = { x: 50, y: 50, z: 150 };
    public yaw = 0;
    public pitch = 0;
    public position = { x: 0, y: 0, z: 0 }; // Position offset for movement

    constructor() {
        super();
        this.base = [
            { x: 0,   y: 0,   z: 100 },
            { x: 100, y: 0,   z: 100 },
            { x: 0,   y: 100, z: 100 },
            { x: 100, y: 100, z: 100 },
            { x: 0,   y: 0,   z: 200 },
            { x: 100, y: 0,   z: 200 },
            { x: 0,   y: 100, z: 200 },
            { x: 100, y: 100, z: 200 },
        ];
        this.edges = [
            [0,1], [1,3], [3,2], [2,0],
            [4,5], [5,7], [7,6], [6,4],
            [0,4], [1,5], [2,6], [3,7]
        ];
        this.applyRotation();
    }

    applyRotation() {
        // First apply rotation
        const rotated = this.base.map(v => rotX(rotY(v, this.center, this.yaw), this.center, this.pitch));
        
        // Then apply translation
        this.vertices = rotated.map(v => ({
            x: v.x + this.position.x,
            y: v.y + this.position.y,
            z: v.z + this.position.z
        }));
    }
    
    // Move the cube by the specified amount
    move(dx: number, dy: number, dz = 0) {
        this.position.x += dx;
        this.position.y += dy;
        this.position.z += dz;
        this.applyRotation();
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

    canvas.onmousedown = (e) => { 
        dragging = true; 
        lastX = e.clientX; 
        lastY = e.clientY; 
    };
    
    canvas.onmouseup = () => { dragging = false; };
    canvas.onmouseleave = () => { dragging = false; };
    
    canvas.onmousemove = (e) => {
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
            cube.applyRotation();
        }
        
        world.render();
    };

    // wheel to zoom (scale screen)
    canvas.onwheel = (e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        screen.zoom = Math.max(0.2, Math.min(5, screen.zoom * factor));
        world.render();
    };
    
    // Display a simple message on the canvas to show controls
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Drag: rotate | Shift+drag: move | Wheel: zoom', 10, canvas.height - 10);
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
