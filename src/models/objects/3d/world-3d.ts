/// <reference path="../../../types.d.ts" />
import { Figure3D } from './figure-3d.js';

/**
 * World space container for 3D figures
 */
export class World3D {
    /** Collection of 3D figures in the world */
    private figures: Figure3D[] = [];

    /**
     * Adds a figure to the world
     *
     * @param figure The 3D figure to add
     */
    addFigure(figure: Figure3D): void {
        this.figures.push(figure);
    }

    /**
     * Gets all figures in the world
     * 
     * @returns Array of 3D figures
     */
    getFigures(): Figure3D[] {
        return this.figures;
    }
}
