/// <reference path="../types.d.ts" />
import { Cube } from '../models/objects/3d/cube.js';
import { CameraEye } from '../models/objects/3d/camera-eye.js';
import { ScreenSpace } from '../models/objects/3d/screen-space.js';
import { World3D } from '../models/objects/3d/world-3d.js';

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

    const canvasCtx = (window as any).ctx as CanvasRenderingContext2D;
    if (!canvasCtx) {
        console.error('Canvas context not found');
        return;
    }

    // Initialize 3D environment
    // Create world first
    const world = new World3D();
    
    // Create screen space for mapping coordinates with reference to world and context
    const screen = new ScreenSpace(canvasCtx, world);
    
    // Create a camera for viewing with reference to screen
    const camera = new CameraEye(screen);
    
    // Set camera position
    camera.position = { x: 0, y: 0, z: -5 };
    
    // Create multiple cubes with different sizes and positions
    // All cubes have the same y-coordinate to place them on the same "ground" level
    const cube1 = new Cube(120, 0, 0, 400);       // Original cube: size 120, at z=400
    const cube2 = new Cube(80, -200, 0, 300);     // Smaller cube to the left
    const cube3 = new Cube(150, 250, 0, 500);     // Larger cube to the right and farther away

    // Access the internal cube structure to set cubes to stand upright
    // This is needed because all cubes have default rotation (yaw=45°, pitch=-30°)
    [cube1, cube2, cube3].forEach((cube: any) => {
        // Cast to any to directly set protected properties
        cube.yaw = 0;
        cube.pitch = 0;
        // Call updateTransform to apply these changes
        cube.updateTransform();
    });

    // Add all cubes to the world
    world.addFigure(cube1);
    world.addFigure(cube2);
    world.addFigure(cube3);
    
    // Initialize toolbar controls
    initToolbarControls(screen, camera);
    
    // Set up event handling for interaction
    setupCubeInteraction(canvas, world, camera, screen);
    
    // Render the scene with the camera
    screen.renderEyeView(camera);

    console.log('Cube drawn and ready for interaction');
}

/**
 * Initialize the toolbar controls
 * @param screen The ScreenSpace object
 * @param camera The CameraEye object
 */
function initToolbarControls(screen: ScreenSpace, camera: CameraEye) {
    // Get the toggle legend checkbox
    const toggleLegendCheckbox = document.getElementById('toggleLegend') as HTMLInputElement;
    
    if (toggleLegendCheckbox) {
        // Set initial state (checkbox is initially checked)
        screen.setShowLegend(toggleLegendCheckbox.checked);
        
        // Add event listener for checkbox changes
        toggleLegendCheckbox.addEventListener('change', () => {
            screen.setShowLegend(toggleLegendCheckbox.checked);
            screen.renderEyeView(camera);
        });
    }
}

/**
 * Sets up interaction with the cube - rotation, movement, and zoom
 * 
 * @param canvas Canvas element for interaction
 * @param world 3D world containing the cube
 * @param camera Camera/eye for perspective
 * @param screen Screen space for rendering
 */
function setupCubeInteraction(
    canvas: HTMLCanvasElement,
    world: World3D,
    camera: CameraEye,
    screen: ScreenSpace
) {
    // Interaction variables
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const yawSpeed = 0.01;
    const pitchSpeed = 0.01;
    const moveSpeed = 1;
    
    // Keyboard control variables
    const cameraRotationSpeed = 0.05; // radians per key press
    const cameraMovementSpeed = 10;   // units per key press
    
    // Track which keys are currently pressed
    const keysPressed = new Set<string>();

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
            // Move the first cube's position in the world
            // In a more advanced implementation, we could implement cube selection
            const cube = world.getFigures()[0] as Cube; // Manipulate only the first cube
            if (cube && typeof cube.move === 'function') {
                cube.move(dx * moveSpeed, -dy * moveSpeed);
            }
        } else {
            // Rotate the first cube
            // In a more advanced implementation, we could implement cube selection
            const cube = world.getFigures()[0] as Cube; // Manipulate only the first cube
            if (cube && typeof cube.rotate === 'function') {
                cube.rotate(dx * yawSpeed, dy * pitchSpeed);
            }
        }

        // Render the updated scene
        screen.renderEyeView(camera);
    });

    // Mouse wheel for zoom
    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        // Apply zoom factor to screen
        screen.zoom *= factor;
        // Render with updated zoom
        screen.renderEyeView(camera);
    }, { passive: false });
    
    // Keyboard events for camera movement
    document.addEventListener('keydown', (e) => {
        keysPressed.add(e.key);
        
        // Update the screen with the current pressed keys
        screen.setActiveKeys(keysPressed);
        
        // Process camera movements based on arrow keys
        switch (e.key) {
            case 'ArrowUp':
                // Move camera forward
                camera.moveForward(cameraMovementSpeed);
                break;
            case 'ArrowDown':
                // Move camera backward
                camera.moveForward(-cameraMovementSpeed);
                break;
            case 'ArrowLeft':
                // Rotate camera left
                camera.rotateYaw(cameraRotationSpeed);
                break;
            case 'ArrowRight':
                // Rotate camera right
                camera.rotateYaw(-cameraRotationSpeed);
                break;
        }
        
        // Always render after any key press
        screen.renderEyeView(camera);
    });
    
    document.addEventListener('keyup', (e) => {
        keysPressed.delete(e.key);
        
        // Update the screen with the current pressed keys
        screen.setActiveKeys(keysPressed);
        screen.renderEyeView(camera);
    });
}

/**
 * Initializes the cube drawing functionality by attaching event listeners
 */
export function initCubeDrawing(): void {
    console.log('Init cube drawing...');
    
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
