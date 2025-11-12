'use client'

import { useState, useEffect } from 'react';

interface InteractiveGridProps {
  className?: string;
}

export default function InteractiveGrid({ className = '' }: InteractiveGridProps) {
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);
  const [gridCols, setGridCols] = useState(50);

  // Calculate grid dimensions to cover full viewport width
  const squareSize = 32;
  const gridRows = Math.ceil(800 / squareSize); // Taller to cover hero section

  useEffect(() => {
    const updateGridCols = () => {
      setGridCols(Math.ceil(window.innerWidth / squareSize));
    };
    
    updateGridCols();
    window.addEventListener('resize', updateGridCols);
    
    return () => window.removeEventListener('resize', updateGridCols);
  }, [squareSize]);

  const totalSquares = gridCols * gridRows;
  const squares = Array.from({ length: totalSquares }, (_, i) => i);

  return (
    <div 
      className={`absolute inset-0 ${className}`} 
      style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, ${squareSize}px)`,
        gridTemplateRows: `repeat(${gridRows}, ${squareSize}px)`,
        gap: '0',
        width: '100vw',
        height: '100%',
        left: '50%',
        transform: 'translateX(-50%)'
      }}
    >
      {squares.map((index) => {
        const isHovered = hoveredSquare === `square-${index}`;
        return (
          <div
            key={index}
            className="grid-square"
            style={{
              width: `${squareSize}px`,
              height: `${squareSize}px`,
              pointerEvents: 'auto',
              backgroundColor: isHovered ? 'var(--grid-hover-color-strong)' : undefined,
            }}
            onMouseEnter={() => setHoveredSquare(`square-${index}`)}
            onMouseLeave={() => setHoveredSquare(null)}
            onClick={(e) => {
              // Check if click should pass through to elements below
              const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
              if (elementBelow && (elementBelow.tagName === 'A' || elementBelow.tagName === 'BUTTON' || elementBelow.closest('a') || elementBelow.closest('button'))) {
                e.target.style.pointerEvents = 'none';
                elementBelow.click();
                setTimeout(() => {
                  e.target.style.pointerEvents = 'auto';
                }, 100);
              }
            }}
          />
        );
      })}
    </div>
  );
}