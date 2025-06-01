import React, { useEffect, useRef } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';

// Import required CSS
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';

export default function VirtualTour() {
  const viewerContainerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!viewerContainerRef.current) return;

    // Base URL pointing to the public/images folder
    const baseUrl = process.env.PUBLIC_URL + '/images/';
    const caption = 'Tour of SQU - Virtual Tour';

    // Function to calculate bearing between two GPS points
    const calculateBearing = (lat1, lon1, lat2, lon2) => {
      const toRadians = (degrees) => degrees * (Math.PI / 180);
      const toDegrees = (radians) => radians * (180 / Math.PI);
      
      const dLon = toRadians(lon2 - lon1);
      const lat1Rad = toRadians(lat1);
      const lat2Rad = toRadians(lat2);
      
      const y = Math.sin(dLon) * Math.cos(lat2Rad);
      const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
                Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
      
      const bearing = Math.atan2(y, x);
      return bearing; // Return in radians for direct use in Photo Sphere Viewer
    };

    // GPS coordinates for each location
    const locations = {
      '1': { lat: 23.591921, lon: 58.168091 },
      '2': { lat: 23.592076, lon: 58.168081 },
      '3': { lat: 23.592016, lon: 58.168205 },
      '4': { lat: 23.592019, lon: 58.168344 }
    };

    // Calculate precise arrow directions based on GPS coordinates
    const nodes = [
      {
        id: '1',
        panorama: baseUrl + 'IMG_20250526_162018_00_003.jpg',
        thumbnail: baseUrl + 'IMG_20250526_162018_00_003.jpg',
        name: 'Node 1 - Starting Point',
        caption: `[1] ${caption}`,
        gps: [locations['1'].lon, locations['1'].lat, 0], // [longitude, latitude, altitude]
        links: [{ 
          nodeId: '2',
          gps: [locations['2'].lon, locations['2'].lat, 0],
          position: { 
            yaw: calculateBearing(locations['1'].lat, locations['1'].lon, locations['2'].lat, locations['2'].lon),
            pitch: 0 
          }
        }]
      },
      {
        id: '2',
        panorama: baseUrl + 'IMG_20250526_162353_00_006.jpg',
        thumbnail: baseUrl + 'IMG_20250526_162353_00_006.jpg',
        name: 'Node 2 - Corridor',
        caption: `[2] ${caption}`,
        gps: [locations['2'].lon, locations['2'].lat, 0],
        links: [
          { 
            nodeId: '1',
            gps: [locations['1'].lon, locations['1'].lat, 0],
            position: { 
              yaw: calculateBearing(locations['2'].lat, locations['2'].lon, locations['1'].lat, locations['1'].lon),
              pitch: 0 
            }
          },
          { 
            nodeId: '3',
            gps: [locations['3'].lon, locations['3'].lat, 0],
            position: { 
              yaw: calculateBearing(locations['2'].lat, locations['2'].lon, locations['3'].lat, locations['3'].lon),
              pitch: 0 
            }
          }
        ]
      },
      {
        id: '3',
        panorama: baseUrl + 'IMG_20250526_162506_00_007.jpg',
        thumbnail: baseUrl + 'IMG_20250526_162506_00_007.jpg',
        name: 'Node 3 - Main Area',
        caption: `[3] ${caption}`,
        gps: [locations['3'].lon, locations['3'].lat, 0],
        links: [
          { 
            nodeId: '2',
            gps: [locations['2'].lon, locations['2'].lat, 0],
            position: { 
              yaw: calculateBearing(locations['3'].lat, locations['3'].lon, locations['2'].lat, locations['2'].lon),
              pitch: 0 
            }
          },
          { 
            nodeId: '4',
            gps: [locations['4'].lon, locations['4'].lat, 0],
            position: { 
              yaw: calculateBearing(locations['3'].lat, locations['3'].lon, locations['4'].lat, locations['4'].lon),
              pitch: 0 
            }
          }
        ]
      },
      {
        id: '4',
        panorama: baseUrl + 'IMG_20250526_162555_00_008.jpg',
        thumbnail: baseUrl + 'IMG_20250526_162555_00_008.jpg',
        name: 'Node 4 - End Point',
        caption: `[4] ${caption}`,
        gps: [locations['4'].lon, locations['4'].lat, 0],
        links: [{ 
          nodeId: '3',
          gps: [locations['3'].lon, locations['3'].lat, 0],
          position: { 
            yaw: calculateBearing(locations['4'].lat, locations['4'].lon, locations['3'].lat, locations['3'].lon),
            pitch: 0 
          }
        }]
      },
    ];

    // Initialize the Viewer if not already created
    if (!viewerRef.current && viewerContainerRef.current) {
      try {
        viewerRef.current = new Viewer({
          container: viewerContainerRef.current,
          panorama: nodes[0].panorama,
          caption: nodes[0].caption,
          loadingImg: null,
          touchmoveTwoFingers: true,
          mousewheelCtrlKey: true,
          defaultYaw: 0, // All images face north
          navbar: [
            'zoom',
            'move',
            'fullscreen'
          ],
          plugins: [
            [
              VirtualTourPlugin,
              {
                positionMode: 'gps', // Use GPS positioning for accurate directions
                renderMode: '3d',
                nodes: nodes,
                startNodeId: '1'
              }
            ]
          ],
        });

        // Add event listeners
        viewerRef.current.addEventListener('ready', () => {
          console.log('Virtual tour with GPS positioning is ready!');
          console.log('Arrow directions calculated from actual GPS coordinates');
        });

        viewerRef.current.addEventListener('error', (err) => {
          console.error('Virtual tour error:', err);
        });

      } catch (error) {
        console.error('Error initializing viewer:', error);
      }
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={viewerContainerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: '#000'
      }} 
    />
  );
} 