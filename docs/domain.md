# 3D → 2D Projection — Domain-Specific Language

* **Camera (Eye)**: Viewpoint at the apex of the viewing volume.
* **World Space**: 3D coordinate system for scene geometry $(x, y, z)$.
* **Screen Space**: 2D coordinate system for display $(x, y)$.
* 
* **Normalized Screen Space (NDC)**: Screen space normalized to $[-1, +1]$ in both axes with $(0,0)$ at the center.
* **Viewing Frustum**: Pyramid-like volume defining visible space from the camera through the screen.
* **Near Plane (Screen)**: Plane at distance **N** from the camera where 3D points are projected.
* **Far Plane**: Distant clipping plane limiting visibility (often ignored in simple demos).
* **Depth (Z)**: Distance from the camera along the view direction; larger **Z** = farther away.
* **Field Of View (FOV)**: Angular extent of the view; vertical FOV = **A**.
* **Half-FOV**: $A/2$; used in projection scaling formulas.
* **Focal Scale FY**: $\cot(A/2)$; vertical scaling factor for perspective projection.
* **Focal Scale FX**: $FY / \text{Aspect}$; horizontal scaling factor for perspective projection.
* **Aspect Ratio**: Width divided by height of the render target.
* **Perspective Projection**: Mapping where apparent size scales with $1/Z$ to preserve depth cues.
* **Orthographic Projection**: Mapping without perspective; size remains constant regardless of **Z**.
* **Ray Tracing**: Image synthesis method by tracing rays from the camera into the scene; not a projection mapping.
* **Similar Triangles Rule**: Geometric principle equating ratios in projection derivation.
* **Projected X (XP)**: $(FX \times X) / Z$; normalized horizontal coordinate on the near plane.
* **Projected Y (YP)**: $(FY \times Y) / Z$; normalized vertical coordinate on the near plane.
* **Pixel Mapping U**: $(W \times (XP + 1)) / 2$; converts normalized X to pixels.
* **Pixel Mapping V**: $(H \times (1 - YP)) / 2$; converts normalized Y to pixels.
* **Canvas Width (W)**: Pixel width of the render surface.
* **Canvas Height (H)**: Pixel height of the render surface.
* **World-To-Camera Transform**: Rotation/translation moving points into camera-centric coordinates.
* **Rotation Matrix**: Linear transformation to rotate points around axes before projection.
* **Pipeline Order**: Apply world transforms → translate so Z > 0 → project to $(XP, YP)$ → map to pixels $(U, V)$.
* **Clipping (Near)**: Discard or specially handle points with $Z \leq 0$ (behind or at the camera) before projection.
