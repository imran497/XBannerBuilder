import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportSectionProps {
  onExport: () => void;
}

export default function ExportSection({ onExport }: ExportSectionProps) {
  return (
    <Accordion type="single" collapsible defaultValue="export" className="bg-secondary border border-border rounded-lg">
      <AccordionItem value="export" className="border-0">
        <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide px-4 text-foreground hover:bg-muted/30">
          Export
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div className="p-3 rounded-md bg-muted text-sm">
            <div className="font-medium mb-1 text-foreground">Export Dimensions</div>
            <div className="text-muted-foreground">1500 × 500 px (Full Resolution)</div>
          </div>

          <Button
            className="w-full cursor-pointer"
            onClick={onExport}
            data-testid="button-download-banner"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Banner
          </Button>

          <p className="text-xs text-muted-foreground">
            Exported as high-quality JPEG at full resolution (1500×500) for maximum clarity on Twitter/X.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
