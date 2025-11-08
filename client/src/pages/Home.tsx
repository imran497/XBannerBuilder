import { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import BackgroundSection from "@/components/BackgroundSection";
import TextSection from "@/components/TextSection";
import IconSection from "@/components/IconSection";
import GitHubSection from "@/components/GitHubSection";
import ExportSection from "@/components/ExportSection";
import TwitterProfilePreview from "@/components/TwitterProfilePreview";
import BannerCanvas, { CanvasHandle, TextProperties } from "@/components/BannerCanvas";
import { FabricObject, IText } from "fabric";

export default function Home() {
  const [background, setBackground] = useState("#ffffff");
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const canvasRef = useRef<CanvasHandle>(null);

  const handleSelectionChange = (object: FabricObject | null) => {
    setSelectedObject(object);
  };

  const updateTextProperties = (props: Partial<TextProperties>) => {
    canvasRef.current?.updateSelectedText(props);
  };

  const getSelectedTextProperties = (): TextProperties | null => {
    if (!selectedObject || selectedObject.type !== 'i-text') return null;
    
    const textObject = selectedObject as IText;
    return {
      text: textObject.text || "",
      fontFamily: textObject.fontFamily || "Inter",
      fontSize: textObject.fontSize || 40,
      fontWeight: String(textObject.fontWeight || "400"),
      fill: String(textObject.fill || "#000000"),
      textAlign: textObject.textAlign || "left",
      left: textObject.left || 0,
      top: textObject.top || 0,
    };
  };

  const handleAddIcon = (svgString: string) => {
    canvasRef.current?.addIcon(svgString);
  };

  const handleAddImage = (imageUrl: string) => {
    canvasRef.current?.addImage(imageUrl);
  };

  const handleExport = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });
    
    const link = document.createElement("a");
    link.download = "twitter-banner.png";
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="flex h-screen w-full">
      <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-lg font-bold">Twitter Banner Generator</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Design your perfect banner
          </p>
        </div>

        <ScrollArea className="flex-1">
          <div className="py-2">
            <BackgroundSection onBackgroundChange={setBackground} />
            <Separator />
            <TextSection 
              selectedTextProperties={getSelectedTextProperties()}
              onTextPropertiesChange={updateTextProperties}
            />
            <Separator />
            <IconSection 
              onAddIcon={handleAddIcon}
              onAddImage={handleAddImage}
            />
            <Separator />
            <GitHubSection />
            <Separator />
            <ExportSection
              showSafeZone={showSafeZone}
              onSafeZoneToggle={setShowSafeZone}
              previewMode={previewMode}
              onPreviewModeToggle={setPreviewMode}
              onExport={handleExport}
            />
          </div>
        </ScrollArea>
      </div>

      <TwitterProfilePreview
        ref={canvasRef}
        background={background}
        showSafeZone={showSafeZone}
        hideControls={previewMode}
        onSelectionChange={handleSelectionChange}
        onExport={handleExport}
      />
    </div>
  );
}
