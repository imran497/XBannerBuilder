'use client'

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Canvas, IText, FabricObject, Rect, Gradient, FabricImage } from "fabric";

// Font loading utility
const loadFont = (fontFamily: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.fonts && document.fonts.load) {
      // Use FontFace API if available
      document.fonts.load(`1em ${fontFamily}`)
        .then(() => {
          // Double-check by creating a temporary element
          const testDiv = document.createElement('div');
          testDiv.style.fontFamily = fontFamily;
          testDiv.style.fontSize = '1px';
          testDiv.style.position = 'absolute';
          testDiv.style.visibility = 'hidden';
          testDiv.textContent = 'Test';
          document.body.appendChild(testDiv);
          
          // Small delay to ensure font is rendered
          setTimeout(() => {
            document.body.removeChild(testDiv);
            resolve();
          }, 100);
        })
        .catch(() => {
          // Fallback to timeout method
          setTimeout(resolve, 300);
        });
    } else {
      // Fallback for older browsers
      const testElement = document.createElement('span');
      testElement.style.fontFamily = fontFamily;
      testElement.style.fontSize = '72px';
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      testElement.style.top = '-9999px';
      testElement.textContent = 'BESbswy';
      
      document.body.appendChild(testElement);
      
      const initialWidth = testElement.offsetWidth;
      
      // Check if font loaded by width change
      const checkFont = () => {
        if (testElement.offsetWidth !== initialWidth) {
          document.body.removeChild(testElement);
          resolve();
        } else {
          setTimeout(checkFont, 50);
        }
      };
      
      // Start checking and timeout after 2 seconds
      setTimeout(checkFont, 50);
      setTimeout(() => {
        if (document.body.contains(testElement)) {
          document.body.removeChild(testElement);
        }
        resolve();
      }, 2000);
    }
  });
};

export interface TextProperties {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fill: string;
  textAlign: string;
  left: number;
  top: number;
}

export interface CanvasHandle {
  updateSelectedText: (props: Partial<TextProperties>) => void;
  addText: (text: string) => void;
  addImage: (imageUrl: string) => void;
  getCanvas: () => Canvas | null;
  setCanvasZoom: (zoom: number) => void;
}

interface BannerCanvasProps {
  background: string;
  onSelectionChange?: (object: FabricObject | null) => void;
}


const BannerCanvas = forwardRef<CanvasHandle, BannerCanvasProps>(
  function BannerCanvas({ background, onSelectionChange }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const backgroundRectRef = useRef<Rect | null>(null);
  const selectedObjectRef = useRef<FabricObject | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const onSelectionChangeRef = useRef(onSelectionChange);

  // Update the ref when onSelectionChange changes
  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useImperativeHandle(ref, () => ({
    updateSelectedText: async (props: Partial<TextProperties>) => {
      if (!fabricCanvasRef.current) return;
      
      // Get active object from Fabric canvas
      const activeObject = fabricCanvasRef.current.getActiveObject() || null;
      
      // Check both selected ref and active object
      let targetObject = selectedObjectRef.current;
      if (!targetObject || targetObject.type !== 'i-text') {
        targetObject = activeObject;
      }
      
      if (!targetObject || targetObject.type !== 'i-text') {
        return;
      }

      const textObject = targetObject as IText;
      
      // Track if font properties changed (need cache clearing)
      let fontChanged = false;
      let fontFamily = textObject.fontFamily;
      
      // Apply changes
      if (props.text !== undefined) {
        textObject.set('text', props.text);
      }
      
      // Always ensure proper width constraint is set
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        const canvasWidth = canvas.width || 1500;
        const maxWidth = canvasWidth - 200; // Padding for full banner width
        
        // Force width constraint for all text objects
        if (!textObject.width || textObject.width > maxWidth) {
          textObject.set('width', maxWidth);
        }
      }
      
      // Handle font family changes with proper loading
      if (props.fontFamily !== undefined) {
        fontFamily = props.fontFamily;
        
        try {
          // Load font before applying it
          await loadFont(props.fontFamily);
          textObject.set('fontFamily', props.fontFamily);
          fontChanged = true;
        } catch (error) {
          console.warn(`Failed to load font: ${props.fontFamily}`);
          // Apply anyway as fallback
          textObject.set('fontFamily', props.fontFamily);
          fontChanged = true;
        }
      }
      
      if (props.fontSize !== undefined) {
        textObject.set('fontSize', props.fontSize);
        fontChanged = true;
      }
      if (props.fontWeight !== undefined) {
        textObject.set('fontWeight', props.fontWeight);
        fontChanged = true;
      }
      if (props.fill !== undefined) textObject.set('fill', props.fill);
      if (props.textAlign !== undefined) {
        textObject.set('textAlign', props.textAlign);
        fontChanged = true;
      }
      if (props.left !== undefined) textObject.set('left', props.left);
      if (props.top !== undefined) textObject.set('top', props.top);

      // Force recalculation and re-render
      textObject.dirty = true;
      textObject.initDimensions();
      textObject.setCoords();
      
      // For font changes, force additional updates
      if (fontChanged) {
        // Clear any cached measurements
        if (textObject._textLines) {
          textObject._textLines = undefined;
        }
        if (textObject.__lineWidths) {
          textObject.__lineWidths = undefined;
        }
        if (textObject.__lineHeights) {
          textObject.__lineHeights = undefined;
        }
        
        // Force complete re-initialization for font changes
        textObject.initDimensions();
        textObject.setCoords();
        
        // Additional force update for font changes
        setTimeout(() => {
          textObject.initDimensions();
          textObject.setCoords();
          canvas.requestRenderAll();
        }, 50);
      }
      
      // Check if text exceeds canvas boundaries and adjust if needed
      if (canvas && textObject.getBoundingRect) {
        const textBounds = textObject.getBoundingRect();
        const canvasWidth = canvas.width || 1500;
        const canvasHeight = canvas.height || 500;
        
        // If text exceeds right boundary, move it left
        if (textBounds.left + textBounds.width > canvasWidth) {
          const newLeft = Math.max(0, canvasWidth - textBounds.width - 20);
          textObject.set('left', newLeft);
        }
        
        // If text exceeds bottom boundary, move it up  
        if (textBounds.top + textBounds.height > canvasHeight) {
          const newTop = Math.max(0, canvasHeight - textBounds.height - 20);
          textObject.set('top', newTop);
        }
        
        // Update coordinates after position adjustment
        textObject.setCoords();
      }
      
      // Make sure the canvas knows the object has changed
      textObject.dirty = true;
      
      // Keep the object selected and ensure it stays selected
      fabricCanvasRef.current.setActiveObject(textObject);
      selectedObjectRef.current = textObject;
      setSelectedObject(textObject);
      
      // Render the canvas
      fabricCanvasRef.current.requestRenderAll();
      
      // Notify parent of the selection (this ensures UI stays in sync)
      onSelectionChangeRef.current?.(textObject);
    },
    setCanvasZoom: (zoomLevel: number) => {
      if (!fabricCanvasRef.current) return;
      fabricCanvasRef.current.setZoom(zoomLevel);
      fabricCanvasRef.current.renderAll();
    },
    addText: async (text: string) => {
      if (!fabricCanvasRef.current) return;
      
      const canvas = fabricCanvasRef.current;
      const canvasWidth = canvas.width || 1500;
      const canvasHeight = canvas.height || 500;
      
      // Ensure Inter font is loaded before creating text
      try {
        await loadFont("Inter");
      } catch (error) {
        console.warn("Failed to load Inter font for new text");
      }
      
      const newText = new IText(text, {
        left: 100,
        top: 200,
        fontFamily: "Inter",
        fontSize: 40,
        fill: "#1f2937",
        splitByGrapheme: true, // Better text wrapping
        width: canvasWidth - 200, // Set max width to prevent overflow
        breakWords: true, // Allow breaking long words
        textAlign: "left",
      });
      
      canvas.add(newText);
      canvas.setActiveObject(newText);
      selectedObjectRef.current = newText;
      setSelectedObject(newText);
      
      // Force proper rendering after font is loaded
      setTimeout(() => {
        newText.initDimensions();
        newText.setCoords();
        canvas.requestRenderAll();
      }, 100);
      
      // Notify parent of the new selection
      onSelectionChangeRef.current?.(newText);
    },
    addImage: (imageUrl: string) => {
      if (!fabricCanvasRef.current) return;
      
      const canvas = fabricCanvasRef.current;
      
      FabricImage.fromURL(imageUrl, {
        crossOrigin: 'anonymous'
      }).then((img) => {
        const maxWidth = 300;
        const maxHeight = 180;
        const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!, 1);
        
        img.set({
          left: 1000,
          top: 150,
          scaleX: scale,
          scaleY: scale,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        selectedObjectRef.current = img;
        setSelectedObject(img);
        canvas.renderAll();
        
        // Notify parent of the new selection
        onSelectionChangeRef.current?.(img);
      });
    },
    getCanvas: () => fabricCanvasRef.current,
  }));

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 1500,
      height: 500,
      backgroundColor: "#ffffff",
    });

    fabricCanvasRef.current = canvas;
    
    // Make canvas responsive to container size
    canvas.setDimensions({
      width: '100%',
      height: '100%'
    }, {
      cssOnly: true
    });

    // Create background rectangle for gradient support
    const bgRect = new Rect({
      left: 0,
      top: 0,
      width: 1500,
      height: 500,
      fill: "#ffffff",
      selectable: false,
      evented: false, // Don't capture events to improve responsiveness
      hoverCursor: 'default',
    });
    canvas.add(bgRect);
    backgroundRectRef.current = bgRect;
    

    // Clear selection when clicking on background (empty area)
    canvas.on('mouse:down', (e) => {
      // If no target (clicking on empty space), clear selection
      if (!e.target) {
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    });

    // Add sample text with font loading
    const initializeSampleText = async () => {
      try {
        await loadFont("Barrio");
      } catch (error) {
        console.warn("Failed to load Barrio font for sample text");
      }
      
      const text = new IText("I am #IndieDev", {
        left: 750, // Center position (1500 / 2)
        top: 250, // Center position (500 / 2)
        fontFamily: "Barrio",
        fontSize: 60,
        fontWeight: "bold",
        fill: "#1f2937",
        splitByGrapheme: true, // Better text wrapping
        width: 1300, // Set max width to prevent overflow (1500 - 200 padding)
        breakWords: true, // Allow breaking long words
        textAlign: "center",
        originX: "center", // Center horizontally
        originY: "center", // Center vertically
      });
      canvas.add(text);
      
      // Set initial selection to the sample text
      setTimeout(() => {
        text.initDimensions();
        text.setCoords();
        canvas.setActiveObject(text);
        canvas.renderAll();
        selectedObjectRef.current = text;
        setSelectedObject(text);
        onSelectionChangeRef.current?.(text);
      }, 150);
    };
    
    initializeSampleText();

    // Selection event handlers
    canvas.on("selection:created", (e) => {
      if (e.selected && e.selected.length > 0) {
        const obj = e.selected[0];
        selectedObjectRef.current = obj;
        setSelectedObject(obj);
        onSelectionChangeRef.current?.(obj);
      }
    });

    canvas.on("selection:updated", (e) => {
      if (e.selected && e.selected.length > 0) {
        const obj = e.selected[0];
        selectedObjectRef.current = obj;
        setSelectedObject(obj);
        onSelectionChangeRef.current?.(obj);
      }
    });

    canvas.on("selection:cleared", () => {
      selectedObjectRef.current = null;
      setSelectedObject(null);
      onSelectionChangeRef.current?.(null);
    });

    canvas.on("object:modified", () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        onSelectionChangeRef.current?.(activeObject);
      }
    });



    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip shortcuts if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      
      // Escape key - deselect active object
      if (e.key === "Escape") {
        canvas.discardActiveObject();
        canvas.renderAll();
      }
      // Delete/Backspace - remove active object
      else if (e.key === "Delete" || e.key === "Backspace") {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          canvas.remove(activeObject);
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, []); // Remove onSelectionChange dependency to prevent canvas recreation

  useEffect(() => {
    if (!fabricCanvasRef.current || !backgroundRectRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const bgRect = backgroundRectRef.current;
    
    // Check if background is a gradient (contains "linear-gradient")
    if (background.startsWith("linear-gradient")) {
      // Parse CSS gradient string
      // Format: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
      const match = background.match(/linear-gradient\((\d+)deg,\s*(.+)\)/);
      if (match) {
        const angle = parseInt(match[1]);
        const stopsStr = match[2];
        
        // Parse color stops
        const stopRegex = /(#[0-9a-fA-F]{6})\s+(\d+)%/g;
        const colorStops: Array<{ offset: number; color: string }> = [];
        let stopMatch;
        
        while ((stopMatch = stopRegex.exec(stopsStr)) !== null) {
          const color = stopMatch[1];
          const position = parseFloat(stopMatch[2]) / 100;
          colorStops.push({ offset: position, color: color });
        }
        
        // Convert angle to Fabric.js gradient coordinates
        const angleRad = (angle - 90) * (Math.PI / 180);
        const coords = {
          x1: 750 - Math.cos(angleRad) * 750,
          y1: 250 - Math.sin(angleRad) * 250,
          x2: 750 + Math.cos(angleRad) * 750,
          y2: 250 + Math.sin(angleRad) * 250,
        };
        
        const gradient = new Gradient({
          type: "linear",
          coords: coords,
          colorStops: colorStops,
        });
        
        bgRect.set("fill", gradient);
      }
    } else {
      // Solid color
      bgRect.set("fill", background);
    }
    
    canvas.renderAll();
  }, [background]);


  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
);

BannerCanvas.displayName = "BannerCanvas";

export default BannerCanvas;
