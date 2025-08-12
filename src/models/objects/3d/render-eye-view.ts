/// <reference path="../../../types.d.ts" />

import { World3D } from './world-3d.js';
import { CameraEye } from './camera-eye.js';
import { ScreenSpace } from './screen-space.js';
import { Figure3D } from './figure-3d.js';

/**
 * Renders the world from a specific camera eye view
 * 
 * DIFFERENCE BETWEEN renderEyeView AND CameraEye:
 * 
 * - renderEyeView is a FUNCTION that orchestrates the rendering process.
 *   It takes a World3D (data), a CameraEye (projection), and a ScreenSpace (display)
 *   as separate parameters and coordinates the rendering pipeline.
 * 
 * - CameraEye is a CLASS that represents the camera itself - its position,
 *   field of view, and projection math. It's responsible for transforming
 *   3D world coordinates to 2D normalized coordinates.
 * 
 * This separation of concerns follows good architecture principles:
 * 1. World3D focuses on data only
 * 2. CameraEye focuses on projection only  
 * 3. ScreenSpace focuses on display mapping only
 * 4. renderEyeView coordinates the entire process
 * 
 * This decoupling allows different rendering approaches with the same world,
 * or viewing the same world from multiple cameras simultaneously.
 * 
 * @param ctx Canvas rendering context to draw on
 * @param world The 3D world containing figures to render
 * @param eye Camera/eye for perspective projection
 * @param screen Screen space for pixel mapping
 */
export function renderEyeView(
    ctx: CanvasRenderingContext2D,
    world: World3D,
    eye: CameraEye,
    screen: ScreenSpace
): void {
    // Clear the canvas
    ctx.clearRect(0, 0, screen.width, screen.height);
    
    // Calculate aspect ratio once
    const aspect = screen.width / screen.height;
    
    // Draw each figure in the world
    for (const figure of world.getFigures()) {
        drawFigure(ctx, figure, eye, screen, aspect);
    }
    
    // Draw UI overlay text
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Drag: rotate | Shift+drag: move | Wheel: zoom', 10, screen.height - 10);
}

/**
 * Draws a single 3D figure from the perspective of a camera
 * 
 * This function performs the actual rendering of a figure.
 * The figure itself does not know how to draw itself - this is the responsibility
 * of the rendering system. This enforces proper separation of concerns.
 * 
 * @param ctx Canvas rendering context
 * @param figure The 3D figure to draw
 * @param eye Camera/eye for perspective projection
 * @param screen Screen space for pixel mapping
 * @param aspect Aspect ratio of the viewport (width/height)
 */
function drawFigure(
    ctx: CanvasRenderingContext2D,
    figure: Figure3D,
    eye: CameraEye,
    screen: ScreenSpace,
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
        const p1 = screen.toPixels(n1);
        const p2 = screen.toPixels(n2);
        
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
        
        const p = screen.toPixels(n);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}
