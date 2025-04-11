'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useDragControls, useMotionValue } from 'framer-motion';
import { AppData } from './types';

interface AppGalleryProps {
  apps: AppData[];
  selectedApp: AppData | null;
  onSelectApp: (app: AppData) => void;
  currentIndex?: number;
}

export default function AppGallery({
  apps,
  selectedApp,
  onSelectApp,
  currentIndex = 0,
}: AppGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  
  // Update active index when currentIndex changes
  useEffect(() => {
    if (currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  }, [currentIndex, activeIndex]);
  
  // Handle when no apps are available
  if (apps.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-xl text-gray-400">No apps found for this category</p>
      </div>
    );
  }
  
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent, 
    info: { offset: { x: number; y: number } }
  ) => {
    const threshold = 50;
    
    if (info.offset.x > threshold && activeIndex > 0) {
      // Dragged right - go to previous
      setActiveIndex(activeIndex - 1);
      onSelectApp(apps[activeIndex - 1]);
    } else if (info.offset.x < -threshold && activeIndex < apps.length - 1) {
      // Dragged left - go to next
      setActiveIndex(activeIndex + 1);
      onSelectApp(apps[activeIndex + 1]);
    }
  };
  
  const handleItemClick = (index: number) => {
    setActiveIndex(index);
    onSelectApp(apps[index]);
  };
  
  return (
    <div
      ref={containerRef}
      className="relative h-96 md:h-[22rem] overflow-hidden rounded-lg"
    >
      {/* Reflection floor - iTunes style with enhanced reflections */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-900 to-transparent opacity-60 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBzdHJva2U9IiMzMzMiIHN0cm9rZS1vcGFjaXR5PSIuMSIgZD0iTS41LjVoMTl2MTloLTE5eiIvPjwvZz48L3N2Zz4=')] opacity-10 pointer-events-none" />
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        drag="x"
        dragControls={dragControls}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
      >
        <div className="relative w-full h-full flex items-center justify-center perspective-1000">
          {apps.map((app, index) => {
            // Calculate position and styling based on distance from active item
            const distance = index - activeIndex;
            
            return (
              <motion.div
                key={app.id}
                className="absolute cursor-pointer"
                animate={{
                  x: `${distance * 60}%`,
                  rotateY: distance * 60, // More rotation for iTunes-like effect
                  scale: 1 - Math.min(0.3, Math.abs(distance) * 0.15),
                  zIndex: apps.length - Math.abs(distance),
                  filter: `brightness(${1 - Math.min(0.5, Math.abs(distance) * 0.25)})`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => handleItemClick(index)}
              >
                <div 
                  className="relative rounded overflow-hidden transition-shadow"
                  style={{ 
                    width: '250px', 
                    height: '250px',
                    boxShadow: index === activeIndex 
                      ? '0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 20px -5px rgba(0, 0, 0, 0.6)' 
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  <Image
                    src={app.imageUrl}
                    alt={app.name}
                    fill
                    className="object-cover"
                    sizes="250px"
                    priority={Math.abs(distance) < 2}
                  />
                  
                  {/* Enhanced Reflection effect - more pronounced */}
                  <div 
                    className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-white to-transparent opacity-25 transform scale-y-[-1] origin-bottom backdrop-blur-sm"
                    style={{
                      maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.3) 50%, rgba(0,0,0,0))',
                      WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.3) 50%, rgba(0,0,0,0))'
                    }}
                  >
                    {/* Reflection image */}
                    <div className="w-full h-full relative transform scale-y-[-1]">
                      <Image
                        src={app.imageUrl}
                        alt=""
                        fill
                        className="object-cover opacity-70"
                        sizes="250px"
                      />
                    </div>
                  </div>
                  
                  {/* Overlay for non-active items to make them less prominent */}
                  {index !== activeIndex && (
                    <div className="absolute inset-0 bg-black bg-opacity-50" />
                  )}
                  
                  {/* App name overlay at bottom */}
                  <div className="absolute bottom-0 inset-x-0 bg-black bg-opacity-70 p-3">
                    <h3 className="text-white font-medium text-center truncate">
                      {app.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      <div className="w-full h-6" />
      
      {/* Slider control - like iTunes */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-3/4 max-w-lg">
        <div className="relative h-1 bg-gray-700 rounded-full">
          <div className="absolute inset-y-0 left-0 right-0">
            <div className="absolute top-1/2 transform -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-md border border-gray-600"
                 style={{ left: `${(activeIndex / (apps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Left/Right navigation arrows */}
      {activeIndex > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-colors"
          onClick={() => handleItemClick(activeIndex - 1)}
          aria-label="Previous app"
        >
          ←
        </button>
      )}
      
      {activeIndex < apps.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-colors"
          onClick={() => handleItemClick(activeIndex + 1)}
          aria-label="Next app"
        >
          →
        </button>
      )}
    </div>
  );
}