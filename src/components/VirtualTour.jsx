import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { VirtualTourPlugin } from '@photo-sphere-viewer/virtual-tour-plugin';
import { GalleryPlugin } from '@photo-sphere-viewer/gallery-plugin';

// Import required CSS
import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/virtual-tour-plugin/index.css';
import '@photo-sphere-viewer/gallery-plugin/index.css';

export default function VirtualTour() {
  const viewerContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentNode, setCurrentNode] = useState('1');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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

  // Check if device is mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    if (!viewerContainerRef.current) return;

    // Base URL pointing to the public/images folder
    const baseUrl = process.env.PUBLIC_URL + '/images/';
    const caption = 'Tour of SQU - Virtual Tour';

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
        gps: [locations['1'].lon, locations['1'].lat, 0],
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
        const mobile = isMobile();
        
        viewerRef.current = new Viewer({
          container: viewerContainerRef.current,
          panorama: nodes[0].panorama,
          caption: nodes[0].caption,
          loadingImg: null,
          loadingTxt: 'Loading Virtual Tour...',
          touchmoveTwoFingers: mobile, // Enable two-finger touch on mobile
          mousewheelCtrlKey: !mobile, // Require Ctrl key on desktop only
          defaultYaw: 0,
          defaultPitch: 0,
          minFov: mobile ? 50 : 30, // Wider field of view on mobile
          maxFov: mobile ? 120 : 90,
          moveSpeed: mobile ? 1.5 : 1, // Faster movement on mobile
          zoomSpeed: mobile ? 2 : 1, // Faster zoom on mobile
          fisheye: false,
          navbar: [
            'zoom',
            'move',
            'download',
            'caption',
            'fullscreen'
          ],
          plugins: [
            [
              VirtualTourPlugin,
              {
                positionMode: 'gps',
                renderMode: '3d',
                nodes: nodes,
                startNodeId: '1',
                markerStyle: {
                  scale: mobile ? [0.8, 1.2] : [0.5, 1], // Larger arrows on mobile
                  color: '#ffffff',
                  hoverColor: '#ffffff'
                },
                arrowStyle: {
                  color: '#ffffff',
                  hoverColor: '#ffffff',
                  scale: mobile ? 1.5 : 1 // Larger arrows on mobile
                }
              }
            ],
            [
              GalleryPlugin,
              {
                thumbnailSize: {
                  width: mobile ? 80 : 100,
                  height: mobile ? 60 : 75
                },
                hideOnMobile: false
              }
            ]
          ],
        });

        // Add event listeners
        viewerRef.current.addEventListener('ready', () => {
          console.log('Virtual tour with GPS positioning is ready!');
          setIsLoading(false);
          
          // Show help overlay on first load for mobile users
          if (mobile && !localStorage.getItem('tour-help-shown')) {
            setShowHelp(true);
            localStorage.setItem('tour-help-shown', 'true');
          }
        });

        viewerRef.current.addEventListener('error', (err) => {
          console.error('Virtual tour error:', err);
          setIsLoading(false);
        });

        // Listen for node changes
        viewerRef.current.addEventListener('node-changed', (e) => {
          setCurrentNode(e.nodeId);
        });

        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', () => {
          setIsFullscreen(!!document.fullscreenElement);
        });

      } catch (error) {
        console.error('Error initializing viewer:', error);
        setIsLoading(false);
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
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Loading Screen */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          color: '#fff'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '3px solid #333',
            borderTop: '3px solid #fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '20px', fontSize: '18px' }}>Loading Virtual Tour...</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}

      {/* Help Overlay for Mobile */}
      {showHelp && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          color: '#fff',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '30px',
            maxWidth: '350px',
            backdropFilter: 'blur(10px)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '24px' }}>Welcome to the Virtual Tour!</h2>
            <div style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '25px' }}>
              <p>📱 <strong>Touch & Drag:</strong> Look around</p>
              <p>🤏 <strong>Pinch:</strong> Zoom in/out</p>
              <p>➡️ <strong>White Arrows:</strong> Navigate between rooms</p>
              <p>🖼️ <strong>Gallery:</strong> Jump to any location</p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                backgroundColor: '#ff6b6b',
                color: '#fff',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            >
              Start Tour
            </button>
          </div>
        </div>
      )}

      {/* Mobile Info Bar */}
      {!isLoading && (
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          right: '15px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '15px',
          padding: '12px 18px',
          color: '#fff',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#4CAF50'
            }}></div>
            <strong>Room {currentNode}</strong> of 4
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setShowHelp(true)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(5px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              ❓ Help
            </button>
            {!isFullscreen && (
              <button
                onClick={toggleFullscreen}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(5px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                ⛶ Fullscreen
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Viewer Container */}
      <div 
        ref={viewerContainerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          backgroundColor: '#000',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }} 
      />
    </div>
  );
} 