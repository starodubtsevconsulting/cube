/// <reference path="../types.d.ts" />
import { Cube } from '../models/objects/3d/cube.js';
import { CameraEye } from '../models/objects/3d/camera-eye.js';
import { ScreenSpace } from '../models/objects/3d/screen-space.js';
import { World3D } from '../models/objects/3d/world-3d.js';
import { renderEyeView } from '../models/objects/3d/render-eye-view.js';

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
    const world = new World3D();

    // Create a cube with size 120, centered at z=400
    const cube = new Cube(120, 0, 0, 400);

    // Add cube to the world and render
    world.addFigure(cube);
    renderEyeView(ctx, world, camera, screen);

    console.log('Cube drawn and ready for interaction');

    // Set up event handling for interaction
    setupCubeInteraction(canvas, cube, ctx, world, camera, screen);
}

/**
 * Sets up user interaction with the 3D cube
 */
function setupCubeInteraction(
    canvas: HTMLCanvasElement,
    cube: Cube,
    ctx: CanvasRenderingContext2D,
    world: World3D,
    camera: CameraEye,
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
        renderEyeView(ctx, world, camera, screen);
    });

    // Mouse wheel for zoom
    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        // Apply zoom factor to screen
        screen.zoom *= factor;
        // Render with updated zoom
        renderEyeView(ctx, world, camera, screen);
    }, { passive: false });
}

/**
 * Initializes the cube drawing functionality by attaching event listeners
 */
export function initCubeDrawing(): void {
    // Add event listener for "Draw the Cube" button
    const drawCubeButton = document.getElementById('drawTheCube');
    if (drawCubeButton) {
        console.log('Cube button found, adding click listener');
        drawCubeButton.addEventListener('click', () => {
            console.log('Draw the Cube button clicked');
            drawTheCube();
        });
    } else {
        console.error('Draw the Cube button not found');
    }
    
    // Also draw the cube on page load
    if (document.readyState === 'complete') {
        drawTheCube();
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            drawTheCube();
        });
    }
}

// Register global functions
(window as any).initCubeDrawing = initCubeDrawing;
(window as any).drawTheCube = drawTheCube;

console.log('Cube controller functions registered globally: ', 
    'window.initCubeDrawing:', typeof (window as any).initCubeDrawing,
    'window.drawTheCube:', typeof (window as any).drawTheCube);
