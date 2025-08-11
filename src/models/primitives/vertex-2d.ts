/**
 * Interface for a 2D vertex with x and y coordinates
 */
export interface Vertex2D {
  x: number;
  y: number;
}

// For backward compatibility, some files might use Point2D
export type Point2D = Vertex2D;
