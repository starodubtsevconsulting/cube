/// <reference path="../../../types.d.ts" />

// Line drawing functionality
export function drawLine(): void {
    console.log('Drawing line... Beginning of function');
    
    // Check if window object exists
    if (typeof window === 'undefined') {
        console.error('Window object not defined');
        return;
    }
    
    console.log('Window object exists');
    
    // Check if ctx is defined and log its type
    console.log('ctx type:', window.ctx ? typeof window.ctx : 'undefined');
    console.log('ctx instanceof CanvasRenderingContext2D:', window.ctx instanceof CanvasRenderingContext2D);
    
    if (!window.ctx) {
        console.error('Canvas context not found');
        return;
    }

    try {
        console.log('Starting to draw line with ctx methods');
        window.ctx.beginPath();
        console.log('beginPath() called');
        window.ctx.moveTo(100, 100);
        console.log('moveTo() called');
        window.ctx.lineTo(700, 500);
        console.log('lineTo() called');
        window.ctx.strokeStyle = '#FF0000'; // Make the line red for visibility
        window.ctx.lineWidth = 5; // Make the line thicker
        window.ctx.stroke();
        console.log('stroke() called - Line drawn successfully');
    } catch (error) {
        console.error('Error during line drawing:', error);
    }
}

// Export this function to be accessible from global scope
export function initLineDrawing(): void {
    console.log('Initializing line drawing');
    
    // Verify window object
    console.log('window defined:', typeof window !== 'undefined');
    
    // Check if document is ready
    console.log('document.readyState:', document.readyState);
    
    const drawLineBtn = document.getElementById('drawLine');
    console.log('drawLine button found:', !!drawLineBtn);
    
    if (drawLineBtn) {
        console.log('Adding click listener to drawLine button');
        drawLineBtn.addEventListener('click', function(event) {
            console.log('Draw Line button clicked!', event);
            drawLine();
        });
        console.log('Line button listener attached');
    } else {
        console.error('Draw Line button not found');
        
        // Additional debugging to check all available buttons
        console.log('Available buttons:', 
            Array.from(document.getElementsByTagName('button'))
                .map(button => ({id: button.id, text: button.textContent})));
    }
}

// Make function available globally for HTML access
if (typeof window !== 'undefined') {
    console.log('Making line drawing functions globally available');
    (window as any).drawLine = drawLine;
    (window as any).initLineDrawing = initLineDrawing;
    console.log('Global functions registered:', 
        'window.drawLine:', typeof (window as any).drawLine, 
        'window.initLineDrawing:', typeof (window as any).initLineDrawing);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', (): void => {
    console.log('DOM content loaded event in line.ts');
    initLineDrawing();
});
