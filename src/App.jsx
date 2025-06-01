import React, { useEffect } from 'react';
import VirtualTour from './components/VirtualTour';

export default function App() {
  useEffect(() => {
    // Set mobile viewport meta tag if not already set
    const viewport = document.querySelector("meta[name=viewport]");
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }

    // Prevent default touch behaviors that interfere with the viewer
    const preventDefaultTouchBehavior = (e) => {
      // Allow pinch zoom and pan gestures within the viewer
      if (e.touches && e.touches.length > 1) {
        return;
      }
      
      // Prevent pull-to-refresh and overscroll
      if (e.target.closest('.psv-container')) {
        e.preventDefault();
      }
    };

    // Add touch event listeners
    document.addEventListener('touchstart', preventDefaultTouchBehavior, { passive: false });
    document.addEventListener('touchmove', preventDefaultTouchBehavior, { passive: false });

    // Prevent context menu on long press
    document.addEventListener('contextmenu', (e) => {
      if (e.target.closest('.psv-container')) {
        e.preventDefault();
      }
    });

    // Set app title
    document.title = 'SQU Virtual Tour - 360° Campus Experience';

    return () => {
      document.removeEventListener('touchstart', preventDefaultTouchBehavior);
      document.removeEventListener('touchmove', preventDefaultTouchBehavior);
    };
  }, []);

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      <VirtualTour />
      
      {/* Global styles for better mobile experience */}
      <style>
        {`
          * {
            box-sizing: border-box;
          }
          
          html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100%;
            width: 100%;
            touch-action: manipulation;
            -webkit-text-size-adjust: 100%;
            -webkit-tap-highlight-color: transparent;
          }

          /* Improve touch targets */
          button, .psv-button {
            min-height: 44px;
            min-width: 44px;
          }

          /* Enhance Photo Sphere Viewer for mobile */
          .psv-container {
            touch-action: manipulation;
          }

          .psv-navbar {
            backdrop-filter: blur(10px);
            background: rgba(0, 0, 0, 0.8) !important;
          }

          .psv-button {
            background: rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            transition: all 0.3s ease !important;
          }

          .psv-button:hover,
          .psv-button.psv-button--active {
            background: rgba(255, 255, 255, 0.2) !important;
            transform: scale(1.05);
          }

          /* Gallery plugin mobile optimization */
          .psv-gallery {
            background: rgba(0, 0, 0, 0.9) !important;
            backdrop-filter: blur(10px);
          }

          .psv-gallery-item {
            border: 2px solid transparent !important;
            border-radius: 8px !important;
            transition: all 0.3s ease !important;
          }

          .psv-gallery-item--active {
            border-color: #ff6b6b !important;
            transform: scale(1.1);
          }

          /* Virtual tour arrows mobile enhancement */
          .psv-virtual-tour-arrow {
            transition: all 0.3s ease !important;
            opacity: 0.9 !important;
          }

          .psv-virtual-tour-arrow:hover {
            opacity: 1 !important;
          }

          /* Loading animation */
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Responsive text sizing */
          @media (max-width: 768px) {
            .psv-caption-content {
              font-size: 14px !important;
              padding: 8px 12px !important;
            }
            
            .psv-navbar {
              height: 50px !important;
            }
            
            .psv-button {
              width: 50px !important;
              height: 50px !important;
            }
          }

          /* Landscape mode adjustments for mobile */
          @media (max-height: 500px) and (orientation: landscape) {
            .mobile-info-bar {
              top: 5px !important;
              padding: 5px 10px !important;
              font-size: 12px !important;
            }
          }

          /* Hide scrollbars */
          ::-webkit-scrollbar {
            display: none;
          }

          /* Smooth scrolling */
          html {
            scroll-behavior: smooth;
          }
        `}
      </style>
    </div>
  );
} 