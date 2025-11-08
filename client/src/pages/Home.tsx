import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import BackgroundSection from "@/components/BackgroundSection";
import TextSection from "@/components/TextSection";
import IconSection from "@/components/IconSection";
import GitHubSection from "@/components/GitHubSection";
import ExportSection from "@/components/ExportSection";
import BannerCanvas from "@/components/BannerCanvas";

export default function Home() {
  const [background, setBackground] = useState("#ffffff");
  const [showSafeZone, setShowSafeZone] = useState(false);

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
            <TextSection />
            <Separator />
            <IconSection />
            <Separator />
            <GitHubSection />
            <Separator />
            <ExportSection
              showSafeZone={showSafeZone}
              onSafeZoneToggle={setShowSafeZone}
              onExport={() => console.log("Exporting banner...")}
            />
          </div>
        </ScrollArea>
      </div>

      <BannerCanvas
        background={background}
        showSafeZone={showSafeZone}
      />
    </div>
  );
}
