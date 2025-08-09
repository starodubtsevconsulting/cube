// Global type declarations

// Extend the Window interface to include our custom properties
declare global {
  interface Window {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
  }
}

// Define a 3D point interface
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Define a 2D point interface
export interface Point2D {
  x: number;
  y: number;
}
