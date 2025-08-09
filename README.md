# 3D Cube Visualization

> How many times in our life do we turn away from the goal that we have set, that keeps recurring again and again? And different events come into our life, and we are just following them, reacting. Being reactive, like they say, - instead of being proactive. Instead of proactively follow what we have set.

[The Train of Thoughts in Extra Dimension](https://sergiistarodubtsev.substack.com/p/the-train-of-thoughts-in-extra-dimension)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm (comes with Node.js)
- Google Chrome (recommended) or any modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cube
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

1. Start the development server:
   ```bash
   npm start
   ```
   This will:
   - Start the TypeScript compiler in watch mode
   - Launch a local development server
   - Open the application in your default browser

2. Start coding! The application will automatically reload when you make changes to the source files.

### Project Structure

```
.
├── src/                  # Source files (TypeScript)
│   ├── canvas.html      # Main HTML entry point
│   ├── cube.ts          # 3D cube implementation
│   ├── line.ts          # Line drawing utilities
│   ├── rectangle.ts     # Rectangle drawing utilities
│   └── circle.ts        # Circle drawing utilities
├── dist/                # Compiled JavaScript (auto-generated)
└── docs/                # Documentation
```

### TypeScript Configuration
- The project uses ES modules (`"type": "module"` in package.json)
- Source files are in `src/` and compiled to `dist/`
- Source maps are enabled for better debugging
- Target: ES2020 for modern browser compatibility

### Available Scripts

- `npm start` - Start development server with auto-reload (stops any running instances first)
- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for file changes and recompile TypeScript files
- `npm run dev` - Build and run the application (useful for testing production build)
- `./stop.sh` - Stop all running services (TypeScript compiler and HTTP server)
- `./cleanup.sh` - Remove old JavaScript files after TypeScript conversion

## 📝 Notes
- The application runs on `http://localhost:8080/src/canvas.html`
- TypeScript files in `src/` are automatically compiled to JavaScript in `dist/`
- The browser will automatically refresh when you make changes to the source files
- Source maps are generated for better debugging experience in browser dev tools
- Use `./stop.sh` to stop all services if they become unresponsive or you want to ensure a clean start
- After converting from JavaScript to TypeScript, run `./cleanup.sh` to remove old `.js` files

## TypeScript Conversion
All JavaScript files have been converted to TypeScript with proper type annotations. The project now includes:

- Type definitions in `src/types.d.ts`
- Strict type checking enabled
- ES modules support
- Source maps for debugging

To complete the conversion:
1. Run `./cleanup.sh` to remove old JavaScript files
2. Run `npm run build` to compile TypeScript to JavaScript
3. Start the development server with `npm start`