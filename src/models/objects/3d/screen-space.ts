/// <reference path="../../../types.d.ts" />
import { Vertex2D } from '../../../types';

/**
 * Screen space handling for converting normalized device coordinates to pixel coordinates
 */
export class ScreenSpace {
    /** Width of the canvas in pixels */
    width = 800;
    /** Height of the canvas in pixels */
    height = 600;

    /** X offset of the screen center relative to top-left origin */
    centerX = this.width / 2;
    /** Y offset of the screen center relative to top-left origin */
    centerY = this.height / 2;

    /**
     * Converts a point from normalized device coordinates ([-1,1]) to pixel coordinates.
     *
     * @param n Point in normalized device coordinates
     * @returns Point in pixel coordinates relative to top-left corner
     */
    toPixels(n: Vertex2D): Vertex2D {
        return {
            x: this.centerX + n.x * this.centerX,
            y: this.centerY - n.y * this.centerY,
        };
    }
}
