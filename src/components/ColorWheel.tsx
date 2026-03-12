'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { hexToHsl, hslToHex, hslToRgb } from '@/lib/colorUtils';

interface ColorWheelProps {
  color1: string;
  color2: string;
  onColor1Change: (color: string) => void;
  onColor2Change: (color: string) => void;
  size?: number;
}

export function ColorWheel({ color1, color2, onColor1Change, onColor2Change, size = 280 }: ColorWheelProps) {
  const [isDragging1, setIsDragging1] = useState(false);
  const [isDragging2, setIsDragging2] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const radius = size / 2;

  const getPositionFromColor = (color: string) => {
    const hsl = hexToHsl(color);
    const angle = (hsl.h - 90) * Math.PI / 180;
    const distance = (hsl.s / 100) * (radius - 20);
    const x = radius + Math.cos(angle) * distance;
    const y = radius + Math.sin(angle) * distance;
    return { x, y };
  };

  const getColorFromPosition = (x: number, y: number) => {
    const dx = x - radius;
    const dy = y - radius;
    let distance = Math.sqrt(dx * dx + dy * dy);
    distance = Math.min(distance, radius - 20);
    
    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    if (angle < 0) angle += 360;
    
    const saturation = (distance / (radius - 20)) * 100;
    const lightness = 50;
    
    return hslToHex(angle, saturation, lightness);
  };

  const handleMouseDown = (e: React.MouseEvent, colorIndex: 1 | 2) => {
    e.preventDefault();
    if (colorIndex === 1) {
      setIsDragging1(true);
    } else {
      setIsDragging2(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, colorIndex: 1 | 2) => {
    e.preventDefault();
    if (colorIndex === 1) {
      setIsDragging1(true);
    } else {
      setIsDragging2(true);
    }
  };

  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    if (!canvasRef.current || (!isDragging1 && !isDragging2)) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const color = getColorFromPosition(x, y);
    
    if (isDragging1) {
      onColor1Change(color);
    } else if (isDragging2) {
      onColor2Change(color);
    }
  }, [isDragging1, isDragging2, onColor1Change, onColor2Change]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleInteraction(e.clientX, e.clientY);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging1(false);
      setIsDragging2(false);
    };
    
    const handleTouchEnd = () => {
      setIsDragging1(false);
      setIsDragging2(false);
    };
    
    if (isDragging1 || isDragging2) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging1, isDragging2, handleInteraction]);

  const pos1 = getPositionFromColor(color1);
  const pos2 = getPositionFromColor(color2);

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        ref={canvasRef}
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="absolute inset-0">
          <defs>
            <radialGradient id="saturationGradient">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="wheelMask">
              <circle cx={radius} cy={radius} r={radius - 20} fill="white" />
            </mask>
          </defs>
          
          {Array.from({ length: 360 }).map((_, i) => (
            <circle
              key={i}
              cx={radius}
              cy={radius}
              r={radius - 20}
              fill="none"
              stroke={`hsl(${i}, 100%, 50%)`}
              strokeWidth="1"
              strokeDasharray={`${(Math.PI * 2 * (radius - 20)) / 360} 1000`}
              strokeDashoffset={`${-(Math.PI * 2 * (radius - 20)) * (i - 90) / 360}`}
              mask="url(#wheelMask)"
            />
          ))}
          
          <circle
            cx={radius}
            cy={radius}
            r={radius - 20}
            fill="url(#saturationGradient)"
          />
        </svg>
        
        <div
          className="absolute w-7 h-7 rounded-full border-3 border-white shadow-lg cursor-grab active:cursor-grabbing z-10"
          style={{
            left: pos1.x - 14,
            top: pos1.y - 14,
            backgroundColor: color1,
            boxShadow: `0 0 0 2px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.3)`,
          }}
          onMouseDown={(e) => handleMouseDown(e, 1)}
          onTouchStart={(e) => handleTouchStart(e, 1)}
        >
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 bg-white/80 px-1 rounded">1</span>
        </div>
        
        <div
          className="absolute w-7 h-7 rounded-full border-3 border-white shadow-lg cursor-grab active:cursor-grabbing z-10"
          style={{
            left: pos2.x - 14,
            top: pos2.y - 14,
            backgroundColor: color2,
            boxShadow: `0 0 0 2px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.3)`,
          }}
          onMouseDown={(e) => handleMouseDown(e, 2)}
          onTouchStart={(e) => handleTouchStart(e, 2)}
        >
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 bg-white/80 px-1 rounded">2</span>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg border-2 border-border"
            style={{ backgroundColor: color1 }}
          />
          <span className="font-mono text-sm">{color1.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg border-2 border-border"
            style={{ backgroundColor: color2 }}
          />
          <span className="font-mono text-sm">{color2.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
