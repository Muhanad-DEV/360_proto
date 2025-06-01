# SQU Virtual Tour

This React project displays a 360° virtual tour of four panoramic images using Photo Sphere Viewer and the Virtual Tour Plugin.

## Folder Structure

```
project-root/
├── public/
│   ├── index.html
│   └── images/
│       ├── IMG_20250526_162018_00_003.jpg
│       ├── IMG_20250526_162353_00_006.jpg
│       ├── IMG_20250526_162506_00_007.jpg
│       └── IMG_20250526_162555_00_008.jpg
├── src/
│   ├── components/
│   │   └── VirtualTour.jsx
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

- **public/images/**: Contains the four panorama images facing north.
- **src/components/VirtualTour.jsx**: React component that initializes the Photo Sphere Viewer and Virtual Tour Plugin.
- **src/App.jsx**: Renders the `VirtualTour` component at full screen.
- **src/index.js**: React entry point.
- **package.json**: Lists dependencies and scripts.
- **README.md**: This file.

## Features

- 360° panoramic virtual tour with 4 connected nodes
- 3D navigation arrows between panoramas
- Gallery plugin with thumbnail navigation
- Responsive design for mobile and desktop
- Touch and mouse wheel controls
- Fullscreen support

## How to Run

1. Ensure you have Node.js and npm installed.
2. In project root, run:
   ```bash
   npm install
   npm start
   ```
3. Open your browser at [http://localhost:3000](http://localhost:3000) to view the virtual tour.

## Usage

- **Navigation**: Click on the 3D arrows to move between panoramas
- **Gallery**: Use the thumbnail gallery at the bottom to jump to any node
- **Controls**: 
  - Mouse drag or touch to look around
  - Mouse wheel (with Ctrl) or pinch to zoom
  - Use the navigation bar for additional controls

## Node Connections

- **Node 1** → **Node 2**
- **Node 2** ↔ **Node 1** & **Node 3**
- **Node 3** ↔ **Node 2** & **Node 4**
- **Node 4** → **Node 3**

## Technical Details

- Built with React 18 and Photo Sphere Viewer v5
- Uses Virtual Tour Plugin for linking panoramas
- All four images are oriented facing north, so each node uses `sphereCorrection: { pan: '0deg' }`
- Configured with `positionMode: 'manual'` since no GPS coordinates are available
- 3D render mode for immersive arrow navigation

## Future Enhancements

- If you obtain actual GPS coordinates (longitude, latitude, altitude) for each image, you can switch `positionMode` to `'gps'` in `VirtualTourPlugin` and add `gps: [long, lat, alt]` to each node.
- Add custom markers for points of interest
- Implement audio narration or descriptions
- Add map integration for location context

## Dependencies

- React & ReactDOM for the application framework
- @photo-sphere-viewer/core for 360° panorama viewing
- @photo-sphere-viewer/virtual-tour-plugin for linking panoramas
- @photo-sphere-viewer/gallery-plugin for thumbnail navigation
- @photo-sphere-viewer/markers-plugin for future marker support 