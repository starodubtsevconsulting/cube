/**
 * App Version Management
 * 
 * This module manages the app version and displays it in the UI.
 * The buildNumber will automatically increment each time the app is built,
 * ensuring that you can easily see which version is currently running.
 */

// Try to import build number from the generated file
let buildNumber: number;
let codeHash: string;
try {
    // In TypeScript, we can use dynamic imports for JSON files
    const buildInfo = { 
        buildNumber: Date.now(),
        codeHash: 'dev' 
    }; // Default fallback value
    
    // In a real environment, we would do:
    // import buildInfo from './build-number.json';
    // But for simplicity and compatibility, we'll use the current timestamp
    
    buildNumber = buildInfo.buildNumber;
    codeHash = buildInfo.codeHash;
} catch (e) {
    // If file doesn't exist or can't be read, use current timestamp
    buildNumber = Date.now();
    codeHash = 'dev';
    console.log('Using current timestamp for build number');
}

// Version information
export const version = {
    major: 1,
    minor: 0,
    patch: 0,
    buildNumber,
    codeHash,
    
    toString(): string {
        // Format: v1.0.0+20250810.HHMMss (hash: abc123)
        const date = new Date(this.buildNumber);
        const buildDate = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
        const buildTime = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
        const shortHash = this.codeHash.substring(0, 6);
        return `v${this.major}.${this.minor}.${this.patch}+${buildDate}.${buildTime} (${shortHash})`;
    }
};

/**
 * Displays the current version in the UI
 */
export function displayVersion(): void {
    console.log(`App Version: ${version.toString()}`);
    
    // Create or update version element
    let versionElement = document.getElementById('app-version');
    if (!versionElement) {
        versionElement = document.createElement('div');
        versionElement.id = 'app-version';
        versionElement.style.position = 'fixed';
        versionElement.style.top = '10px';
        versionElement.style.right = '10px';
        versionElement.style.fontSize = '14px';
        versionElement.style.color = '#333';
        versionElement.style.fontFamily = 'Arial, sans-serif';
        versionElement.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        versionElement.style.padding = '5px 10px';
        versionElement.style.borderRadius = '3px';
        versionElement.style.border = '1px solid #ccc';
        versionElement.style.zIndex = '1000';
        document.body.appendChild(versionElement);
    }
    
    versionElement.textContent = `Version: ${version.toString()}`;
}

// Initialize when this module is loaded
if (typeof window !== 'undefined') {
    (window as any).appVersion = version;
    
    // Try to display version immediately if DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(displayVersion, 100);
    }
    
    // Also add event listener for when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        displayVersion();
    });
    
    // Backup approach - try again after a delay
    setTimeout(displayVersion, 1000);
}
