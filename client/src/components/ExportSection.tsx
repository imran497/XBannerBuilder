import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Download } from "lucide-react";

interface ExportSectionProps {
  showSafeZone: boolean;
  onSafeZoneToggle: (show: boolean) => void;
  previewMode: boolean;
  onPreviewModeToggle: (preview: boolean) => void;
  onExport: () => void;
}

export default function ExportSection({ showSafeZone, onSafeZoneToggle, previewMode, onPreviewModeToggle, onExport }: ExportSectionProps) {
  return (
    <Accordion type="single" collapsible defaultValue="export">
      <AccordionItem value="export">
        <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide px-4">
          Export
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="preview-mode" className="text-sm font-medium">
              Hide Toolbar
            </Label>
            <Switch
              id="preview-mode"
              checked={previewMode}
              onCheckedChange={onPreviewModeToggle}
              data-testid="switch-preview-mode"
            />
          </div>
          
          <p className="text-xs text-muted-foreground -mt-2">
            Toggle to hide editing controls and see a clean preview
          </p>

          <div className="flex items-center justify-between">
            <Label htmlFor="safe-zone" className="text-sm font-medium">
              Safe Zone Overlay
            </Label>
            <Switch
              id="safe-zone"
              checked={showSafeZone}
              onCheckedChange={onSafeZoneToggle}
              data-testid="switch-safe-zone"
            />
          </div>

          <div className="p-3 rounded-md bg-muted text-sm">
            <div className="font-medium mb-1">Banner Dimensions</div>
            <div className="text-muted-foreground">1500 × 500 px</div>
          </div>

          <Button
            className="w-full"
            onClick={onExport}
            data-testid="button-download-banner"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>

          <p className="text-xs text-muted-foreground">
            Your banner will be exported as a high-quality PNG ready for upload to Twitter/X.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
