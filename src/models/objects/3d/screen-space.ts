/// <reference path="../../../types.d.ts" />

/**
 * Screen space handling for converting normalized device coordinates to pixel coordinates
 */
export class ScreenSpace {
    /** Width of the canvas in pixels */
    width = 800;
    
    /** Height of the canvas in pixels */
    height = 600;
    
    /** Zoom factor for scaling the view */
    zoom = 1.0;

    /**
     * Converts a point from normalized device coordinates ([-1,1]) to pixel coordinates.
     *
     * @param n Point in normalized device coordinates
     * @returns Point in pixel coordinates relative to top-left corner
     */
    toPixels(n: {x: number; y: number}): {x: number; y: number} {
        const cx = this.width * 0.5;
        const cy = this.height * 0.5;
        const s = cy * this.zoom;
        
        return {
            x: cx + n.x * s,
            y: cy - n.y * s
        };
    }
}
