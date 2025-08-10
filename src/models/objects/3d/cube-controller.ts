/// <reference path="../../../types.d.ts" />
import { Cube } from './cube.js';
import { CameraEye } from './camera-eye.js';
import { ScreenSpace } from './screen-space.js';
import { World3D } from './world-3d.js';

/**
 * Main function to draw and initialize the interactive 3D cube
 */
export function drawTheCube(): void {
    console.log('Draw Cube function called');

    // Get canvas and context
    const canvas = (window as any).canvas as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }

    const ctx = (window as any).ctx as CanvasRenderingContext2D;
    if (!ctx) {
        console.error('Canvas context not found');
        return;
    }

    // Initialize 3D environment
    const screen = new ScreenSpace();
    screen.width = canvas.width;
    screen.height = canvas.height;

    const camera = new CameraEye();
    const world = new World3D(camera, screen);

    // Create a cube with size 120, centered at z=400
    const cube = new Cube(120, 0, 0, 400);

    // Add cube to the world and render
    world.addFigure(cube);
    world.render(ctx);

    console.log('Cube drawn and ready for interaction');

    // Set up event handling for interaction
    setupCubeInteraction(canvas, cube, ctx, world, screen);
}

/**
 * Sets up user interaction with the 3D cube
 */
function setupCubeInteraction(
    canvas: HTMLCanvasElement,
    cube: Cube,
    ctx: CanvasRenderingContext2D,
    world: World3D,
    screen: ScreenSpace
): void {
    // Interaction variables
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const yawSpeed = 0.01;
    const pitchSpeed = 0.01;
    const moveSpeed = 1;

    // Pointer events for rotation/movement
    canvas.addEventListener('pointerdown', e => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointerup', () => {
        dragging = false;
    });

    canvas.addEventListener('pointerleave', () => {
        dragging = false;
    });

    canvas.addEventListener('pointermove', e => {
        if (!dragging) return;

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;

        if (e.shiftKey) {
            // Move the cube when Shift key is pressed
            cube.move(dx * moveSpeed, -dy * moveSpeed);
        } else {
            // Rotate the cube when no modifier key is pressed
            cube.rotate(dx * yawSpeed, dy * pitchSpeed);
        }

        // Render the updated scene
        world.render(ctx);
    });

    // Mouse wheel for zoom
    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        // Apply zoom factor and render
        // In this refactored version, we don't have screen.zoom yet
        // We can implement it later if needed
        world.render(ctx);
    }, { passive: false });
}

/**
 * Initializes the cube drawing functionality by attaching event listeners
 */
export function initCubeDrawing(): void {
    console.log('Initializing cube drawing');

    const btn = document.getElementById('drawTheCube');
    if (btn) {
        btn.addEventListener('click', drawTheCube);
        console.log('Draw cube button listener added');
    } else {
        console.error('Draw cube button not found');
    }
}

// Make functions globally available
if (typeof window !== 'undefined') {
    (window as any).drawTheCube = drawTheCube;
    (window as any).initCubeDrawing = initCubeDrawing;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCubeDrawing();
});
