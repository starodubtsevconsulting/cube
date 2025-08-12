# 3D → 2D Projection — Domain-Specific Language

## Core Domain Entities

### Camera (Eye)
**Description**: The viewpoint from which the 3D world is observed and projected onto a 2D surface.  
**Rules**:
- Positioned in 3D space with x, y, z coordinates
- Defines field of view (FOV) which determines how much of the scene is visible
- Performs perspective projection calculations to transform 3D points to 2D normalized coordinates
- Must maintain near and far planes to define the viewing frustum

**References**: [Camera projection](https://en.wikipedia.org/wiki/Camera_matrix), [Viewing frustum](https://en.wikipedia.org/wiki/Viewing_frustum)

### Figure3D
**Description**: Abstract base class for all 3D objects in the world.  
**Rules**:
- Maintains two vertex sets: base (original) and vertices (transformed)
- Contains rotation and position information
- Knows how to transform itself (rotate, move)
- Defines edges as pairs of vertex indices
- Has no knowledge of rendering or projection

### Cube
**Description**: A concrete 3D figure with 8 vertices and 12 edges forming a regular hexahedron.  
**Rules**:
- Extends Figure3D
- Defined by a size and position in 3D space
- Contains 8 vertices and 12 edges
- Initial vertices are positioned to form a cube centered at the given position

**References**: [Cube](https://en.wikipedia.org/wiki/Cube)

### World3D
**Description**: Container that holds and organizes all 3D figures in the scene.  
**Rules**:
- Maintains a collection of Figure3D objects
- Pure data container with no rendering or projection capabilities
- Provides access to its figures for rendering systems

## Geometric Primitives

### Vertex3D
**Description**: A point in 3D space.  
**Rules**:
- Has x, y, z numeric coordinates
- Used for representing positions in world space
- Subject to transformations (rotation, translation)

### Vertex2D
**Description**: A point in 2D space.  
**Rules**:
- Has x, y numeric coordinates
- Used for representing projected points on the screen
- Sometimes aliased as Point2D for backward compatibility

### Edge
**Description**: A connection between two vertices.  
**Rules**:
- Defined as a pair of vertex indices (array of two numbers)
- References vertices by their position in a vertex array
- Used to draw lines between vertices

## Projection and Rendering Concepts

### Screen Space
**Description**: 2D coordinate system for display $(x, y)$.  
**Rules**:
- Has width and height dimensions matching the display canvas
- Converts normalized device coordinates (-1 to +1) to pixel coordinates
- Handles zooming functionality
- Responsible for rendering the scene after projection

### Normalized Screen Space (NDC)
**Description**: Screen space normalized to $[-1, +1]$ in both axes with $(0,0)$ at the center.  
**Rules**:
- Used for perspective projection calculations
- Simplifies transformations and projections

### Perspective Projection
**Description**: The mathematical technique used to project 3D points onto a 2D surface while preserving depth cues.  
**Rules**:
- Objects appear smaller as they get farther from the camera
- Based on the formula: X' = (X * n) / Z, Y' = (Y * n) / Z
- Where n is derived from field of view: n = 1 / tan(fov/2)
- Requires positive Z values (objects must be in front of camera)

**References**: [Perspective projection](https://en.wikipedia.org/wiki/3D_projection#Perspective_projection)

### Viewing Frustum
**Description**: The 3D volume visible from the camera, shaped like a truncated pyramid.  
**Rules**:
- Defined by camera position, field of view, and near/far planes
- Only objects within this volume are visible
- Near plane is where projection occurs
- Far plane limits the visible distance (often simplified in basic implementations)

**References**: [Viewing frustum](https://en.wikipedia.org/wiki/Viewing_frustum)

### Near Plane (Screen)
**Description**: Plane at distance **N** from the camera where 3D points are projected.  
**Rules**:
- Defines the start of the viewing frustum
- Used for perspective projection calculations

### Far Plane
**Description**: Distant clipping plane limiting visibility (often ignored in simple demos).  
**Rules**:
- Defines the end of the viewing frustum
- Used to optimize rendering by culling distant objects

### Depth (Z)
**Description**: Distance from the camera along the view direction; larger **Z** = farther away.  
**Rules**:
- Used for perspective projection calculations
- Determines the order of rendering for overlapping objects

### Field Of View (FOV)
**Description**: Angular extent of the view; vertical FOV = **A**.  
**Rules**:
- Determines the amount of the scene visible to the camera
- Used for perspective projection calculations

### Half-FOV
**Description**: $A/2$; used in projection scaling formulas.  
**Rules**:
- Used for perspective projection calculations
- Simplifies transformations and projections

### Focal Scale FY
**Description**: $\cot(A/2)$; vertical scaling factor for perspective projection.  
**Rules**:
- Used for perspective projection calculations
- Determines the vertical scaling of the projected image

### Focal Scale FX
**Description**: $FY / \text{Aspect}$; horizontal scaling factor for perspective projection.  
**Rules**:
- Used for perspective projection calculations
- Determines the horizontal scaling of the projected image

### Aspect Ratio
**Description**: Width divided by height of the render target.  
**Rules**:
- Used for perspective projection calculations
- Determines the aspect ratio of the projected image

### Rotation
**Description**: Transformation that rotates points around X or Y axes.  
**Rules**:
- Used for rotating 3D objects
- Can be combined with other transformations

### Pipeline Order
**Description**: Transform figures → project through camera → map to screen → render.  
**Rules**:
- Defines the order of operations for rendering a 3D scene
- Ensures correct transformations and projections

### Canvas Width (W)
**Description**: Pixel width of the render surface.  
**Rules**:
- Used for rendering the scene
- Determines the horizontal resolution of the rendered image

### Canvas Height (H)
**Description**: Pixel height of the render surface.  
**Rules**:
- Used for rendering the scene
- Determines the vertical resolution of the rendered image
