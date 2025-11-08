import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { Canvas, IText, FabricObject, Rect, Gradient, FabricImage, loadSVGFromString, util, Circle } from "fabric";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, Trash2 } from "lucide-react";

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
  addIcon: (svgString: string) => void;
  addImage: (imageUrl: string) => void;
  getCanvas: () => Canvas | null;
  setCanvasZoom: (zoom: number) => void;
}

interface BannerCanvasProps {
  background: string;
  showSafeZone: boolean;
  hideControls?: boolean;
  onExport?: () => void;
  onSelectionChange?: (object: FabricObject | null) => void;
}

const BannerCanvas = forwardRef<CanvasHandle, BannerCanvasProps>(
  function BannerCanvas({ background, showSafeZone, hideControls = false, onExport, onSelectionChange }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const backgroundRectRef = useRef<Rect | null>(null);
  const safeZoneRectsRef = useRef<Rect[]>([]);
  const selectedObjectRef = useRef<FabricObject | null>(null);
  const [zoom, setZoom] = useState(1);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [objects, setObjects] = useState<FabricObject[]>([]);

  useImperativeHandle(ref, () => ({
    updateSelectedText: (props: Partial<TextProperties>) => {
      if (!fabricCanvasRef.current) return;
      
      // Use ref-tracked selection first, fallback to Fabric's active object
      let targetObject = selectedObjectRef.current;
      if (!targetObject) {
        targetObject = fabricCanvasRef.current.getActiveObject() || null;
      }
      
      if (!targetObject || targetObject.type !== 'i-text') return;

      const textObject = targetObject as IText;
      
      if (props.text !== undefined) textObject.set('text', props.text);
      if (props.fontFamily !== undefined) textObject.set('fontFamily', props.fontFamily);
      if (props.fontSize !== undefined) textObject.set('fontSize', props.fontSize);
      if (props.fontWeight !== undefined) textObject.set('fontWeight', props.fontWeight);
      if (props.fill !== undefined) textObject.set('fill', props.fill);
      if (props.textAlign !== undefined) textObject.set('textAlign', props.textAlign);
      if (props.left !== undefined) textObject.set('left', props.left);
      if (props.top !== undefined) textObject.set('top', props.top);

      textObject.setCoords();
      fabricCanvasRef.current.renderAll();
    },
    setCanvasZoom: (zoomLevel: number) => {
      if (!fabricCanvasRef.current) return;
      setCanvasZoom(zoomLevel);
      fabricCanvasRef.current.setZoom(zoomLevel);
      fabricCanvasRef.current.renderAll();
    },
    addText: (text: string) => {
      if (!fabricCanvasRef.current) return;
      
      const newText = new IText(text, {
        left: 150,
        top: 150,
        fontFamily: "Inter",
        fontSize: 40,
        fill: "#000000",
      });
      
      fabricCanvasRef.current.add(newText);
      fabricCanvasRef.current.setActiveObject(newText);
      fabricCanvasRef.current.renderAll();
    },
    addIcon: (svgString: string) => {
      if (!fabricCanvasRef.current) return;
      
      const canvas = fabricCanvasRef.current;
      
      loadSVGFromString(svgString).then(({ objects, options }) => {
        const filteredObjects = objects.filter((obj): obj is FabricObject => obj !== null);
        const obj = util.groupSVGElements(filteredObjects, options);
        obj.set({
          left: 750 - (obj.width || 0) / 2,
          top: 250 - (obj.height || 0) / 2,
          scaleX: 2,
          scaleY: 2,
        });
        canvas.add(obj);
        canvas.setActiveObject(obj);
        canvas.renderAll();
      });
    },
    addImage: (imageUrl: string) => {
      if (!fabricCanvasRef.current) return;
      
      const canvas = fabricCanvasRef.current;
      
      FabricImage.fromURL(imageUrl, {
        crossOrigin: 'anonymous'
      }).then((img) => {
        const maxWidth = 400;
        const maxHeight = 400;
        const scale = Math.min(maxWidth / img.width!, maxHeight / img.height!, 1);
        
        img.set({
          left: 750,
          top: 250,
          scaleX: scale,
          scaleY: scale,
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
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

    // Create background rectangle for gradient support
    const bgRect = new Rect({
      left: 0,
      top: 0,
      width: 1500,
      height: 500,
      fill: "#ffffff",
      selectable: false,
      evented: true, // Allow it to receive click events
      hoverCursor: 'default',
    });
    canvas.add(bgRect);
    backgroundRectRef.current = bgRect;
    
    // Clear selection when clicking on background
    canvas.on('mouse:down', (e) => {
      // If click target is the background rect, clear selection
      if (e.target === bgRect) {
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    });

    // Add sample text
    const text = new IText("Your Twitter Banner", {
      left: 100,
      top: 200,
      fontFamily: "Inter",
      fontSize: 60,
      fontWeight: "bold",
      fill: "#1f2937",
    });
    canvas.add(text);
    setObjects([text]);

    // Selection event handlers
    canvas.on("selection:created", (e) => {
      if (e.selected && e.selected.length > 0) {
        const obj = e.selected[0];
        selectedObjectRef.current = obj;
        setSelectedObject(obj);
        onSelectionChange?.(obj);
      }
    });

    canvas.on("selection:updated", (e) => {
      if (e.selected && e.selected.length > 0) {
        const obj = e.selected[0];
        selectedObjectRef.current = obj;
        setSelectedObject(obj);
        onSelectionChange?.(obj);
      }
    });

    canvas.on("selection:cleared", () => {
      selectedObjectRef.current = null;
      setSelectedObject(null);
      onSelectionChange?.(null);
    });

    canvas.on("object:modified", () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        onSelectionChange?.(activeObject);
      }
    });

    // Update objects list when canvas changes
    canvas.on("object:added", () => {
      setObjects([...canvas.getObjects()]);
    });

    canvas.on("object:removed", () => {
      setObjects([...canvas.getObjects()]);
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
  }, [onSelectionChange]);

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

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 2);
    setZoom(newZoom);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setZoom(newZoom);
      fabricCanvasRef.current.renderAll();
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.5);
    setZoom(newZoom);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setZoom(newZoom);
      fabricCanvasRef.current.renderAll();
    }
  };

  const handleAddText = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const text = new IText("New Text", {
      left: 150,
      top: 150,
      fontFamily: "Inter",
      fontSize: 40,
      fill: "#000000",
    });
    
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (!fabricCanvasRef.current || !selectedObject) return;
    
    fabricCanvasRef.current.remove(selectedObject);
    fabricCanvasRef.current.discardActiveObject();
    fabricCanvasRef.current.renderAll();
    setSelectedObject(null);
  }, [selectedObject]);

  const handleBringForward = useCallback(() => {
    if (!fabricCanvasRef.current || !selectedObject) return;
    
    fabricCanvasRef.current.bringObjectForward(selectedObject);
    fabricCanvasRef.current.renderAll();
  }, [selectedObject]);

  const handleSendBackward = useCallback(() => {
    if (!fabricCanvasRef.current || !selectedObject) return;
    
    fabricCanvasRef.current.sendObjectBackwards(selectedObject);
    fabricCanvasRef.current.renderAll();
  }, [selectedObject]);

  const handleExport = () => {
    if (!fabricCanvasRef.current) return;
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });
    
    const link = document.createElement("a");
    link.download = "twitter-banner.png";
    link.href = dataURL;
    link.click();
    
    onExport?.();
  };

  return (
    <div className={hideControls ? "" : "flex-1 flex flex-col items-center justify-center bg-[#1a1a1a] p-8 overflow-auto"}>
      <div className="relative">
        {!hideControls && (
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center",
              transition: "transform 0.2s ease",
            }}
          >
            <canvas ref={canvasRef} className="shadow-2xl" />
            {showSafeZone && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-[10%] top-[10%] right-[10%] bottom-[10%] border-2 border-dashed border-yellow-400 opacity-50" />
                <div className="absolute left-[10%] top-[10%] text-xs text-yellow-400 bg-black/50 px-2 py-1 rounded">
                  Safe Zone
                </div>
              </div>
            )}
          </div>
        )}
        {hideControls && (
          <div className="relative">
            <canvas ref={canvasRef} />
            {showSafeZone && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Avatar circle safe zone at 96px from left, overlapping bottom */}
                <div className="absolute border-2 border-dashed border-yellow-400 opacity-50 rounded-full" 
                     style={{ left: '96px', bottom: '-60px', width: '120px', height: '120px' }} />
                {/* General safe zones */}
                <div className="absolute left-[10%] top-[10%] right-[10%] bottom-[10%] border-2 border-dashed border-yellow-400 opacity-30" />
                <div className="absolute left-[10%] top-[10%] text-xs text-yellow-400 bg-black/50 px-2 py-1 rounded">
                  Safe Zone
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!hideControls && (
        <>
          <div className="flex items-center gap-2 mt-6">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleZoomOut}
              data-testid="button-zoom-out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-white px-3">{Math.round(zoom * 100)}%</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleZoomIn}
              data-testid="button-zoom-in"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-white/20 mx-2" />
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAddText}
              data-testid="button-add-text"
            >
              Add Text
            </Button>
            {selectedObject && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleBringForward}
                  data-testid="button-bring-forward"
                >
                  Forward
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleSendBackward}
                  data-testid="button-send-backward"
                >
                  Backward
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleDeleteSelected}
                  data-testid="button-delete-selected"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
            <div className="w-px h-6 bg-white/20 mx-2" />
            <Button onClick={handleExport} data-testid="button-export-banner">
              <Download className="w-4 h-4 mr-2" />
              Export PNG
            </Button>
          </div>

          <div className="text-xs text-white/50 mt-3">
            1500 × 500 px • {objects.length} object{objects.length !== 1 ? "s" : ""}
          </div>
        </>
      )}
    </div>
  );
}
);

BannerCanvas.displayName = "BannerCanvas";

export default BannerCanvas;
