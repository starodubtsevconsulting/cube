/// <reference path="../../../types.d.ts" />
import { Edge, Vertex3D } from '../../../types';

/* ---------- CameraEye.ts ---------- */
export class CameraEye {
  position: Vertex3D = { x: 0, y: 0, z: 0 };
  fovY = (60 * Math.PI) / 180;

  /** world → normalized screen ([-1,1], half-height = 1) */
  projectNorm(p: Vertex3D, aspect: number): { x: number; y: number } | null {
    const cx = p.x - this.position.x;
    const cy = p.y - this.position.y;
    const cz = p.z - this.position.z;

    // behind or at camera → skip
    if (!(cz > 0)) return null;

    const t = Math.tan(this.fovY / 2);
    const xn = (cx / (cz * t)) / aspect;
    const yn =  cy / (cz * t);

    // invalid numbers → skip
    if (!Number.isFinite(xn) || !Number.isFinite(yn)) return null;

    return { x: xn, y: yn };
  }
}

/* ---------- ScreenSpace.ts ---------- */
export class ScreenSpace {
    constructor(public width: number, public height: number, public zoom = 1) {}
    toPixels(n: { x: number; y: number }) {
        const cx = this.width / 2, cy = this.height / 2;
        const s = (this.height / 2) * this.zoom;   // <— zoom scales the 1×1 screen
        return { x: cx + n.x * s, y: cy - n.y * s };
    }
}

/* helpers */
function rotateY(p: Vertex3D, c: Vertex3D, rad: number): Vertex3D {
  const x = p.x - c.x, z = p.z - c.z;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  return { x: c.x + x*cos + z*sin, y: p.y, z: c.z - x*sin + z*cos };
}

function rotateX(p: Vertex3D, c: Vertex3D, rad: number): Vertex3D {
  const y = p.y - c.y, z = p.z - c.z;
  const cos = Math.cos(rad), sin = Math.sin(rad);
  return { x: p.x, y: c.y + y*cos - z*sin, z: c.z + y*sin + z*cos };
}

/* ---------- WorldSpace.ts ---------- */
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

/* ---------- Figure3D.ts ---------- */
export abstract class Figure3D {
  protected vertices: Vertex3D[] = [];
  protected edges: Edge[] = [];

  public draw(camera: CameraEye, screen: ScreenSpace, aspect: number): void {
    for (const [a, b] of this.edges) {
      if (a >= this.vertices.length || b >= this.vertices.length) continue;

      const n1 = camera.projectNorm(this.vertices[a], aspect);
      const n2 = camera.projectNorm(this.vertices[b], aspect);
      if (!n1 || !n2) continue;  // critical: skip bad edges

      const p1 = screen.toPixels(n1);
      const p2 = screen.toPixels(n2);

      (window as any).ctx?.beginPath();
      (window as any).ctx?.moveTo(p1.x, p1.y);
      (window as any).ctx?.lineTo(p2.x, p2.y);
      (window as any).ctx?.stroke();
    }
  }
}

/* ---------- Cube.ts ---------- */
export class Cube extends Figure3D {
  constructor() {
    super();
    this.vertices = [
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
    
    const center: Vertex3D = { x: 50, y: 50, z: 150 }; // cube center
    const yaw   = 20 * Math.PI / 180;  // turn left/right
    const pitch = -10 * Math.PI / 180; // tilt up/down

    this.vertices = this.vertices.map(v => rotateX(rotateY(v, center, yaw), center, pitch));
  }
}

/* ---------- bootstrap ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('drawTheCube');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const canvas = (window as any).canvas as HTMLCanvasElement;
    const screen = new ScreenSpace(canvas.width, canvas.height, 1.5); // 1.5× zoom
    const camera = new CameraEye(); // (0,0,0)

    const world = new WorldSpace(camera, screen);
    world.addFigure(new Cube());
    world.render();
  });
});
