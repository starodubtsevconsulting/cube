/// <reference path="../../../types.d.ts" />
import { Figure3D } from './figure-3d.js';
import { CameraEye } from './camera-eye.js';
import { ScreenSpace } from './screen-space.js';

/**
 * World space rendering environment for 3D figures
 */
export class World3D {
    /** Collection of 3D figures to render */
    private figures: Figure3D[] = [];

    /**
     * Constructor for the 3D world
     *
     * @param camera Camera for perspective projection
     * @param screen Screen space for 2D rendering
     */
    constructor(
        private camera: CameraEye,
        private screen: ScreenSpace
    ) {}

    /**
     * Adds a figure to the world
     *
     * @param figure The 3D figure to add
     */
    addFigure(figure: Figure3D): void {
        this.figures.push(figure);
    }

    /**
     * Renders all figures in the world
     *
     * @param ctx Canvas rendering context
     */
    render(ctx: CanvasRenderingContext2D): void {
        // Clear the canvas
        ctx.clearRect(0, 0, this.screen.width, this.screen.height);

        // Calculate aspect ratio
        const aspect = this.screen.width / this.screen.height;

        // Draw each figure
        for (const figure of this.figures) {
            figure.draw(ctx, this.camera, this.screen);
        }

        // Draw UI overlay text
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Drag: rotate | Shift+drag: move | Wheel: zoom', 10, this.screen.height - 10);
    }
}
