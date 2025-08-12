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
    
    /** Reference to the 3D world to be rendered */
    private world: World3D;
    
    /** Canvas rendering context for drawing */
    private canvasCtx: CanvasRenderingContext2D;
    
    /**
     * Creates a new screen space converter
     * 
     * @param canvasCtx Canvas rendering context
     * @param world Reference to a 3D world
     */
    constructor(canvasCtx: CanvasRenderingContext2D, world: World3D) {
        this.canvasCtx = canvasCtx;
        this.width = canvasCtx.canvas.width;
        this.height = canvasCtx.canvas.height;
        this.world = world;
    }
    
    /**
     * Sets a new 3D world reference for this screen
     * 
     * @param world The 3D world to render on this screen
     */
    setWorld(world: World3D): void {
        this.world = world;
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
        const scaledX = centerX + (x * this.zoom);
        const scaledY = centerY + (y * this.zoom);
        
        return { x: scaledX, y: scaledY };
    }
    
    /**
     * Renders the world from a specific camera eye view onto this screen space
     * 
     * This function belongs in ScreenSpace because conceptually, rendering happens
     * on the viewing plane (screen) where the 3D world is projected to 2D.
     * The eye provides the projection math, but the screen is where the image forms.
     * 
     * @param eye Camera/eye for perspective projection
     */
    renderEyeView(eye: CameraEye): void {
        // Clear the canvas
        this.canvasCtx.clearRect(0, 0, this.width, this.height);
        
        // Calculate aspect ratio once
        const aspect = this.width / this.height;
        
        // Draw each figure in the world
        for (const figure of this.world.getFigures()) {
            this.drawFigure(this.canvasCtx, figure, eye, aspect);
        }
        
        // Draw UI overlay text
        this.canvasCtx.font = '12px Arial';
        this.canvasCtx.fillStyle = 'black';
        this.canvasCtx.fillText('Drag: rotate | Shift+drag: move | Wheel: zoom', 10, this.height - 10);
    }
    
    /**
     * Renders the world from a specific camera eye view onto this screen space
     * (Legacy method for backward compatibility)
     * 
     * @param ctx Canvas rendering context to draw on
     * @param world The 3D world containing figures to render
     * @param eye Camera/eye for perspective projection
     * @deprecated Use setWorld() and renderEyeView(ctx, eye) instead
     */
    renderEyeViewWithWorld(
        ctx: CanvasRenderingContext2D,
        world: World3D,
        eye: CameraEye
    ): void {
        // Set the world reference for future calls
        this.world = world;
        
        // Use the provided context for this render call
        const originalCtx = this.canvasCtx;
        this.canvasCtx = ctx;
        
        // Delegate to the simplified method
        this.renderEyeView(eye);
        
        // Restore the original context
        this.canvasCtx = originalCtx;
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
        // Project all vertices first and store them
        const projectedVertices = figure.vertices.map(vertex => {
            const proj = eye.projectNorm(vertex);
            if (!proj) return null;
            return {
                projected: proj,
                pixel: this.toPixels(proj)
            };
        });
        
        // Draw faces if the figure has them
        if ('faces' in figure && Array.isArray(figure.faces) && 
            'faceColors' in figure && Array.isArray(figure.faceColors)) {
            
            // Calculate average Z distance for each face for depth sorting
            const facesWithDepth = figure.faces.map((face, index) => {
                // Calculate average Z distance of the face vertices
                let totalDistance = 0;
                let visibleVertices = 0;
                
                for (const vertexIndex of face) {
                    const projected = projectedVertices[vertexIndex];
                    if (projected) {
                        totalDistance += projected.projected.distance;
                        visibleVertices++;
                    }
                }
                
                const avgDistance = visibleVertices > 0 ? totalDistance / visibleVertices : Infinity;
                
                return {
                    faceIndex: index,
                    face: face,
                    avgDistance: avgDistance
                };
            });
            
            // Sort faces by distance (back-to-front)
            facesWithDepth.sort((a, b) => b.avgDistance - a.avgDistance);
            
            // Draw faces in depth-sorted order
            for (const { faceIndex, face } of facesWithDepth) {
                const vertices = face.map((idx: number) => projectedVertices[idx]);
                
                // Skip face if any vertex is not visible
                if (vertices.some((v: any) => v === null)) continue;
                
                // Draw filled face
                const color = figure.faceColors[faceIndex];
                ctx.fillStyle = color;
                
                ctx.beginPath();
                ctx.moveTo(vertices[0].pixel.x, vertices[0].pixel.y);
                
                for (let i = 1; i < vertices.length; i++) {
                    ctx.lineTo(vertices[i].pixel.x, vertices[i].pixel.y);
                }
                
                ctx.closePath();
                ctx.fill();
            }
        }
        
        // Default edge style
        ctx.strokeStyle = 'rgba(0, 128, 255, 0.8)';
        ctx.lineWidth = 2;
        
        // Draw each edge of the figure
        for (const [a, b] of figure.edges) {
            const v1 = projectedVertices[a];
            const v2 = projectedVertices[b];
            
            // Skip if either vertex is not visible
            if (!v1 || !v2) continue;
            
            // Draw the edge
            ctx.beginPath();
            ctx.moveTo(v1.pixel.x, v1.pixel.y);
            ctx.lineTo(v2.pixel.x, v2.pixel.y);
            ctx.stroke();
        }
        
        // Calculate distance range for all visible vertices
        // to normalize our depth effect
        let minDist = Infinity;
        let maxDist = 0;
        const visibleVertices = projectedVertices.filter(v => v !== null);
        
        for (const v of visibleVertices) {
            minDist = Math.min(minDist, v.projected.distance);
            maxDist = Math.max(maxDist, v.projected.distance);
        }
        
        // Ensure we have a reasonable distance range
        const distRange = Math.max(maxDist - minDist, 1);
        
        // Draw vertices as small circles with depth-based coloring
        for (const vertex of visibleVertices) {
            // Calculate how "in focus" the vertex is based on its distance
            // 1.0 = closest (fully in focus), 0.0 = farthest (out of focus)
            const focusLevel = 1.0 - ((vertex.projected.distance - minDist) / distRange);
            
            // Apply color based on focus level - more transparent and less red for distant vertices
            const red = Math.floor(255 * focusLevel);
            const opacity = 0.3 + (focusLevel * 0.7); // Range from 0.3 to 1.0
            
            // Set fill style with distance-based color
            ctx.fillStyle = `rgba(${red}, 0, 128, ${opacity})`;
            
            // Draw the vertex
            ctx.beginPath();
            ctx.arc(vertex.pixel.x, vertex.pixel.y, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
