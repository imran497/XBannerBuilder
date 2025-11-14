'use client'

import { useState, useRef } from "react";
import { Galdeano } from 'next/font/google';
import BackgroundSection from "./components/BackgroundSection";
import TextSection from "./components/TextSection";
import ImageSection from "./components/ImageSection";
import GitHubSection from "./components/GitHubSection";
import ExportSection from "./components/ExportSection";
import XProfilePreview from "./components/XProfilePreview";
import { LogoWithText } from "./components/Logo";
import { PreviewThemeSwitch } from "./components/PreviewThemeSwitch";
import { CanvasHandle, TextProperties } from "./components/BannerCanvas";
import { FabricObject, IText } from "fabric";

const galdeano = Galdeano({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  const [background, setBackground] = useState("linear-gradient(135deg, #f093fb 0%, #f5576c 100%)");
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
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
      <div>
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <LogoWithText size={40} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-[1200px] mx-auto px-6 py-16 text-center">
          <h1 className={`${galdeano.className} text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-foreground`}>
            Make Stunning{' '}
            <span
              className="inline-block px-4 py-1 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/assets/images/pink_bg.svg')",
              }}
            >
              X Headers
            </span>
            <br />in Seconds
          </h1>
          <p className="max-w-2xl mx-auto" style={{ fontSize: '.9rem', color: '#545454', fontWeight: 200 }}>
            Design professional X banners with beautiful gradients, perfect typography, and real-time preview. No design skills required – just point, click, and create.
          </p>
        </div>
      </div>

      {/* Main Content - Grid Layout for sticky support */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_650px] gap-6 px-6">
        {/* Editing Options - Left column on desktop, second on mobile */}
        <div className="order-2 lg:order-1 py-6 space-y-6 pb-12">
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

        {/* Preview Section - Right column on desktop, first on mobile, sticky */}
        <div className="order-1 lg:order-2 py-6 lg:py-6">
          <div className="sticky top-6">
            <div className="absolute -top-10 right-0 lg:right-auto lg:left-full lg:ml-4 z-10">
              <PreviewThemeSwitch
                theme={previewTheme}
                onThemeChange={setPreviewTheme}
              />
            </div>
            <div className="flex justify-center">
              <XProfilePreview
                ref={canvasRef}
                background={background}
                hideControls={false}
                onSelectionChange={handleSelectionChange}
                theme={previewTheme}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
