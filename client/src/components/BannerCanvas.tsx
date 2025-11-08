import { useEffect, useRef, useState } from "react";
import { Canvas, IText } from "fabric";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut } from "lucide-react";

interface BannerCanvasProps {
  background: string;
  showSafeZone: boolean;
  onExport?: () => void;
}

export default function BannerCanvas({ background, showSafeZone, onExport }: BannerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 1500,
      height: 500,
      backgroundColor: "#ffffff",
    });

    fabricCanvasRef.current = canvas;

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

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.backgroundColor = background;
    fabricCanvasRef.current.renderAll();
  }, [background]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

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
    <div className="flex-1 flex flex-col items-center justify-center bg-[#1a1a1a] p-8 overflow-auto">
      <div className="relative">
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
      </div>

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
        <Button onClick={handleExport} data-testid="button-export-banner">
          <Download className="w-4 h-4 mr-2" />
          Export PNG
        </Button>
      </div>

      <div className="text-xs text-white/50 mt-3">
        1500 × 500 px
      </div>
    </div>
  );
}
