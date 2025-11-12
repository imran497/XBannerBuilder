'use client'

import { useState, useRef } from "react";
import Link from "next/link";
import BackgroundSection from "../components/BackgroundSection";
import TextSection from "../components/TextSection";
import ImageSection from "../components/ImageSection";
import GitHubSection from "../components/GitHubSection";
import ExportSection from "../components/ExportSection";
import XProfilePreview from "../components/XProfilePreview";
import { LogoWithText } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { CanvasHandle, TextProperties } from "../components/BannerCanvas";
import { FabricObject, IText } from "fabric";

export default function Editor() {
  const [background, setBackground] = useState("linear-gradient(135deg, #ffde4f 0%, #ffffff 100%)");
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

  const handleAddImage = (imageUrl: string) => {
    canvasRef.current?.addImage(imageUrl);
  };

  const handleAddText = () => {
    canvasRef.current?.addText("New Text");
  };

  const handleExport = () => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    // Export at full resolution for best quality
    const dataURL = canvas.toDataURL({
      format: 'jpeg',
      quality: 0.95, // High quality JPEG (95%)
      multiplier: 1, // Full 1500x500 resolution
      enableRetinaScaling: false, // Prevent double scaling
    });

    const link = document.createElement("a");
    link.download = "x-banner.jpg";
    link.href = dataURL;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <LogoWithText size={40} />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row">
        {/* Preview Section - First on mobile/tablet, right on desktop */}
        <div className="w-full lg:w-[650px] p-6 order-1 lg:order-2">
          <div className="lg:sticky lg:top-6 w-full">
            <XProfilePreview
              ref={canvasRef}
              background={background}
              hideControls={false}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>

        {/* Editing Options - Second on mobile/tablet, left on desktop */}
        <div className="w-full lg:flex-1 order-2 lg:order-1">
          <div className="p-6 space-y-6 pb-12">
          <BackgroundSection onBackgroundChange={setBackground} />
          
          <TextSection 
            selectedTextProperties={getSelectedTextProperties()}
            onTextPropertiesChange={updateTextProperties}
            onAddText={handleAddText}
          />
          
          <ImageSection 
            onAddImage={handleAddImage}
          />
          
          <GitHubSection />
          
          <ExportSection
            onExport={handleExport}
          />
          </div>
        </div>
      </div>
    </div>
  );
}