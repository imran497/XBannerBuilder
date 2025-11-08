import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Search, Heart, Star, Zap, Home, User, Mail, Phone, Camera, Music, Video } from "lucide-react";
import { useState, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const ICONS = [
  { Icon: Heart, name: "Heart" },
  { Icon: Star, name: "Star" },
  { Icon: Zap, name: "Zap" },
  { Icon: Home, name: "Home" },
  { Icon: User, name: "User" },
  { Icon: Mail, name: "Mail" },
  { Icon: Phone, name: "Phone" },
  { Icon: Camera, name: "Camera" },
  { Icon: Music, name: "Music" },
  { Icon: Video, name: "Video" }
];

interface IconSectionProps {
  onAddIcon?: (svgString: string) => void;
  onAddImage?: (imageUrl: string) => void;
}

export default function IconSection({ onAddIcon, onAddImage }: IconSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredIcons = ICONS.filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconClick = (IconComponent: React.ComponentType<{ className?: string }>) => {
    const svgElement = renderToStaticMarkup(
      <IconComponent />
    );
    
    const cleanSvg = svgElement
      .replace(/<svg[^>]*>/, (match) => {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
      })
      .replace(/\s*class="[^"]*"/g, '')
      .replace(/\s*data-[^=]*="[^"]*"/g, '')
      .trim();
    
    onAddIcon?.(cleanSvg);
  };

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
    <Accordion type="single" collapsible>
      <AccordionItem value="icons">
        <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide px-4">
          Icons & Images
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Upload Image</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              data-testid="input-file-upload"
            />
            <Button
              variant="outline"
              className="w-full border-dashed h-24 flex flex-col gap-2"
              data-testid="button-upload-image"
              onClick={handleUploadClick}
            >
              <Upload className="w-6 h-6" />
              <span className="text-sm">Click to upload or drag and drop</span>
            </Button>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Icon Library</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                data-testid="input-icon-search"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-5 gap-2 mt-3">
              {filteredIcons.map(({ Icon, name }) => (
                <button
                  key={name}
                  data-testid={`button-icon-${name.toLowerCase()}`}
                  className="aspect-square flex items-center justify-center rounded-md border hover-elevate active-elevate-2"
                  title={name}
                  onClick={() => handleIconClick(Icon)}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
