/// <reference path="../../../types.d.ts" />
import { Edge, Vertex3D } from '../../../types';

/* ---------- CameraEye ---------- */
export class CameraEye {
    position: Vertex3D = { x: 0, y: 0, z: 0 };
    fovY = (60 * Math.PI) / 180;

    projectNorm(p: Vertex3D, aspect: number): { x: number; y: number } | null {
        const cx = p.x - this.position.x;
        const cy = p.y - this.position.y;
        const cz = p.z - this.position.z;
        if (!(cz > 0)) return null;

        const t = Math.tan(this.fovY / 2);
        const xn = (cx / (cz * t)) / aspect;
        const yn =  cy / (cz * t);
        if (!Number.isFinite(xn) || !Number.isFinite(yn)) return null;
        return { x: xn, y: yn };
    }
}

/* ---------- ScreenSpace ---------- */
export class ScreenSpace {
    constructor(public width: number, public height: number, public zoom = 1) {}
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

/* ---------- Cube (rotatable) ---------- */
export class Cube extends Figure3D {
    private base: Vertex3D[];
    public center: Vertex3D = { x: 50, y: 50, z: 150 };
    public yaw = 0;
    public pitch = 0;

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
        this.vertices = this.base.map(v => rotX(rotY(v, this.center, this.yaw), this.center, this.pitch));
    }
}

/* ---------- bootstrap (mouse drag + wheel zoom) ---------- */
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('drawTheCube');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const canvas = (window as any).canvas as HTMLCanvasElement;
        const screen = new ScreenSpace(canvas.width, canvas.height, 1); // start 1x
        const camera = new CameraEye();
        const world = new WorldSpace(camera, screen);
        const cube = new Cube();

        world.addFigure(cube);
        world.render();

        // drag to rotate
        let dragging = false, lastX = 0, lastY = 0;
        const yawSpeed = 0.01, pitchSpeed = 0.01;

        canvas.onmousedown = (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; };
        canvas.onmouseup = () => { dragging = false; };
        canvas.onmouseleave = () => { dragging = false; };
        canvas.onmousemove = (e) => {
            if (!dragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX; lastY = e.clientY;
            cube.yaw   += dx * yawSpeed;
            cube.pitch += dy * pitchSpeed;
            cube.applyRotation();
            world.render();
        };

        // wheel to zoom (scale screen)
        canvas.onwheel = (e) => {
            e.preventDefault();
            const factor = e.deltaY < 0 ? 1.1 : 0.9;
            screen.zoom = Math.max(0.2, Math.min(5, screen.zoom * factor));
            world.render();
        };
    });
});
