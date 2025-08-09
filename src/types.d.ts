// Global type declarations

// Extend the Window interface to include our custom properties
declare global {
  interface Window {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
  }
}

// Define a 3D point interface (better name is Vertex3D)
export interface Vertex3D {
  x: number;
  y: number;
  z: number;
}

/** Edges connect two vertices. That is the only way we can draw anything using the lines */
export type Edge = [number, number];

// Define a 2D point interface
export interface Point2D {
  x: number;
  y: number;
}
