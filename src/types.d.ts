// Extend the Window interface to provide typing for global canvas elements
declare global {
    interface Window {
        ctx: CanvasRenderingContext2D;
        canvas: HTMLCanvasElement;
        appVersion: any;
        drawLine: Function;
        drawCircle: Function;
        drawRectangle: Function;
        drawTheCube: Function;
        clearCanvas: Function;
        initLineDrawing: Function;
        initCircleDrawing: Function;
        initRectangleDrawing: Function;
        initCubeDrawing: Function;
        initClearCanvas: Function;
    }
}

// This empty export makes TypeScript treat this file as a module
export {}
