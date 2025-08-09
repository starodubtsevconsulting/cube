// Shared canvas context
let canvas, ctx;

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('drawingCanvas');
    ctx = canvas.getContext('2d');

    // Set default styles
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#3498db';
});

// Export the context for other modules to use
export { canvas, ctx };
