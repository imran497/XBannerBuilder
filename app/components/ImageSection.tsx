'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useRef } from "react";

interface ImageSectionProps {
  onAddImage?: (imageUrl: string) => void;
}

export default function ImageSection({ onAddImage }: ImageSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      onAddImage?.(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Accordion type="single" collapsible className="bg-secondary border border-border rounded-lg">
      <AccordionItem value="images" className="border-0">
        <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide px-4 text-foreground hover:bg-muted/30">
          Images
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block text-foreground">Upload Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              data-testid="input-file-upload"
            />
            <Button
              variant="ghost"
              className="w-full h-24 flex flex-col gap-2 bg-muted/20 hover:bg-muted/40 transition-colors"
              data-testid="button-upload-image"
              onClick={handleUploadClick}
            >
              <Upload className="w-6 h-6 text-foreground" />
              <span className="text-sm text-foreground">Click to upload or drag and drop</span>
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
