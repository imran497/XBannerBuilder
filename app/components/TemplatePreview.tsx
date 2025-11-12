'use client'

import { useEffect, useRef, useState } from "react";
import { Canvas, IText, Rect, Gradient, FabricImage } from "fabric";
import { SavedTemplate } from "../lib/templates";

interface TemplatePreviewProps {
  template: SavedTemplate;
  width?: number;
  height?: number;
  className?: string;
}

const loadFont = (fontFamily: string): Promise<void> => {
  return new Promise((resolve) => {
    if (document.fonts && document.fonts.load) {
      document.fonts.load(`1em ${fontFamily}`)
        .then(() => resolve())
        .catch(() => resolve());
    } else {
      setTimeout(resolve, 100);
    }
  });
};

export default function TemplatePreview({ 
  template, 
  width = 300, 
  height = 100, 
  className = "" 
}: TemplatePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize fabric canvas
    const canvas = new Canvas(canvasRef.current, {
      width: width,
      height: height,
      selection: false,
      backgroundColor: '#171923',
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;

    // Disable all interactions for preview
    canvas.forEachObject((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });

    renderTemplate();

    return () => {
      canvas.dispose();
    };
  }, [template, width, height]);

  const createBackgroundRect = async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const background = template.background;
    
    if (background.includes('gradient')) {
      // Parse gradient
      const gradientMatch = background.match(/linear-gradient\(([^)]+)\)/);
      if (gradientMatch) {
        const gradientStr = gradientMatch[1];
        const parts = gradientStr.split(',').map(s => s.trim());
        
        let angle = 135; // default
        let colors: string[] = [];
        let stops: number[] = [];
        
        parts.forEach(part => {
          if (part.includes('deg')) {
            angle = parseInt(part);
          } else if (part.includes('#') || part.includes('rgb')) {
            const colorMatch = part.match(/(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgb\([^)]+\))/);
            const stopMatch = part.match(/(\d+)%/);
            
            if (colorMatch) {
              colors.push(colorMatch[1]);
              stops.push(stopMatch ? parseInt(stopMatch[1]) / 100 : colors.length === 1 ? 0 : 1);
            }
          }
        });

        if (colors.length >= 2) {
          // Convert angle to fabric.js coordinates
          const angleRad = (angle - 90) * Math.PI / 180;
          const coords = {
            x1: width / 2 - Math.cos(angleRad) * width / 2,
            y1: height / 2 - Math.sin(angleRad) * height / 2,
            x2: width / 2 + Math.cos(angleRad) * width / 2,
            y2: height / 2 + Math.sin(angleRad) * height / 2,
          };

          const gradient = new Gradient({
            type: 'linear',
            coords: coords,
            colorStops: colors.map((color, index) => ({
              color: color,
              offset: stops[index] || (index / (colors.length - 1))
            }))
          });

          const rect = new Rect({
            left: 0,
            top: 0,
            width: width,
            height: height,
            fill: gradient,
            selectable: false,
            evented: false,
          });

          canvas.add(rect);
          canvas.sendObjectToBack(rect);
        }
      }
    } else {
      // Solid color
      const rect = new Rect({
        left: 0,
        top: 0,
        width: width,
        height: height,
        fill: background,
        selectable: false,
        evented: false,
      });

      canvas.add(rect);
      canvas.sendObjectToBack(rect);
    }
  };

  const renderTemplate = async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    try {
      // Clear canvas
      canvas.clear();

      // Add background
      await createBackgroundRect();

      // Scale factor for preview (original is 1500x500)
      const scaleX = width / 1500;
      const scaleY = height / 500;

      // Add text objects
      for (const textObj of template.textObjects) {
        try {
          await loadFont(textObj.fontFamily);
          
          const text = new IText(textObj.text, {
            left: textObj.left * scaleX,
            top: textObj.top * scaleY,
            fontFamily: textObj.fontFamily,
            fontSize: textObj.fontSize * Math.min(scaleX, scaleY),
            fontWeight: textObj.fontWeight,
            fill: textObj.fill,
            textAlign: textObj.textAlign as any,
            selectable: false,
            evented: false,
            splitByGrapheme: true,
          });

          canvas.add(text);
        } catch (error) {
          console.warn('Error adding text to preview:', error);
        }
      }

      // Add images
      for (const imageObj of template.images) {
        if (imageObj.url) {
          try {
            const img = await FabricImage.fromURL(imageObj.url, {
              crossOrigin: 'anonymous'
            });

            img.set({
              left: imageObj.left * scaleX,
              top: imageObj.top * scaleY,
              scaleX: imageObj.scaleX * scaleX,
              scaleY: imageObj.scaleY * scaleY,
              selectable: false,
              evented: false,
            });

            canvas.add(img);
          } catch (error) {
            console.warn('Error loading image in preview:', error);
          }
        }
      }

      canvas.renderAll();
      setIsLoaded(true);
    } catch (error) {
      console.error('Error rendering template preview:', error);
      setIsLoaded(true);
    }
  };

  return (
    <div className={`relative bg-muted rounded-lg overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <span className="text-muted-foreground text-xs">Loading...</span>
        </div>
      )}
    </div>
  );
}