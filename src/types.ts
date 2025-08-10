/**
 * Represents a vertex (point) in 3D space
 */
export interface Vertex3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Represents an edge connecting two vertices
 * The array contains indices referring to positions in a vertices array
 */
export type Edge = [number, number];
