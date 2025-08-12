/// <reference path="../../../types.d.ts" />

import { Vertex2D } from "../../primitives/vertex-2d.js";
import { World3D } from "./world-3d.js";
import { CameraEye } from "./camera-eye.js";
import { Figure3D } from "./figure-3d.js";

/**
 * Handles conversion from normalized device coordinates
 * to pixel coordinates on screen, including zoom
 */
export class ScreenSpace {
    /** Canvas width in pixels */
    width: number;
    
    /** Canvas height in pixels */
    height: number;
    
    /** Current zoom level */
    zoom: number = 1.0;
    
    /**
     * Creates a new screen space converter
     * 
     * @param width Canvas width in pixels
     * @param height Canvas height in pixels
     */
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
    
    /**
     * Converts normalized device coordinates (-1 to 1) to pixel coordinates
     * 
     * @param normalizedPoint Point in normalized device coordinates
     * @returns Pixel coordinates on the canvas
     */
    toPixels(normalizedPoint: Vertex2D): Vertex2D {
        // Get the center of the screen
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Convert normalized coordinates to centered pixel coordinates
        // The x coordinate goes from -1 (left) to 1 (right)
        // The y coordinate goes from -1 (bottom) to 1 (top) in our convention
        const x = normalizedPoint.x * centerX; // -center to +center range
        const y = -normalizedPoint.y * centerY; // -center to +center range (inverted y)
        
        // Apply zoom around the center point
        const zoomedX = x * this.zoom;
        const zoomedY = y * this.zoom;
        
        // Translate back to top-left origin coordinate system
        return {
            x: centerX + zoomedX,
            y: centerY + zoomedY
        };
    }

    /**
     * Renders the world from a specific camera eye view onto this screen space
     * 
     * This function belongs in ScreenSpace because conceptually, rendering happens
     * on the viewing plane (screen) where the 3D world is projected to 2D.
     * The eye provides the projection math, but the screen is where the image forms.
     * 
     * @param ctx Canvas rendering context to draw on
     * @param world The 3D world containing figures to render
     * @param eye Camera/eye for perspective projection
     */
    renderEyeView(
        ctx: CanvasRenderingContext2D,
        world: World3D,
        eye: CameraEye
    ): void {
        // Clear the canvas
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Calculate aspect ratio once
        const aspect = this.width / this.height;
        
        // Draw each figure in the world
        for (const figure of world.getFigures()) {
            this.drawFigure(ctx, figure, eye, aspect);
        }
        
        // Draw UI overlay text
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Drag: rotate | Shift+drag: move | Wheel: zoom', 10, this.height - 10);
    }

    /**
     * Draws a single 3D figure from the perspective of a camera onto this screen space
     * 
     * This function performs the actual rendering of a figure on the viewing plane.
     * The figure itself does not know how to draw itself - this is the responsibility
     * of the screen/viewing plane where the 2D image forms.
     * 
     * @param ctx Canvas rendering context
     * @param figure The 3D figure to draw
     * @param eye Camera/eye for perspective projection
     * @param aspect Aspect ratio of the viewport (width/height)
     */
    private drawFigure(
        ctx: CanvasRenderingContext2D,
        figure: Figure3D,
        eye: CameraEye,
        aspect: number
    ): void {
        // Default edge style
        ctx.strokeStyle = 'rgba(0, 128, 255, 0.8)';
        ctx.lineWidth = 2;
        
        // Draw each edge of the figure
        for (const [a, b] of figure.edges) {
            const v1 = figure.vertices[a];
            const v2 = figure.vertices[b];
            
            // Project vertices to normalized device coordinates
            const n1 = eye.projectNorm(v1, aspect);
            const n2 = eye.projectNorm(v2, aspect);
            
            // Skip if either vertex is not visible
            if (!n1 || !n2) continue;
            
            // Convert normalized coordinates to pixel coordinates
            const p1 = this.toPixels(n1);
            const p2 = this.toPixels(n2);
            
            // Draw the edge
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
        
        // Draw vertices as small circles
        ctx.fillStyle = 'rgba(255, 0, 128, 0.8)';
        
        for (const vertex of figure.vertices) {
            const n = eye.projectNorm(vertex, aspect);
            if (!n) continue; // Skip if not visible
            
            const p = this.toPixels(n);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
