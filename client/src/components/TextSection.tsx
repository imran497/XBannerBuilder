import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import ColorPicker from "./ColorPicker";

const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Playfair Display",
  "Lora",
  "Merriweather",
  "Space Grotesk",
  "JetBrains Mono"
];

const FONT_WEIGHTS = [
  { label: "Light", value: "300" },
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semibold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Black", value: "900" }
];

export default function TextSection() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="text">
        <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide px-4">
          Text
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Text Type</Label>
            <Select defaultValue="heading">
              <SelectTrigger data-testid="select-text-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="heading">Heading</SelectItem>
                <SelectItem value="paragraph">Paragraph</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Text Content</Label>
            <Input
              data-testid="input-text-content"
              placeholder="Enter your text..."
              defaultValue="Your Twitter Banner"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Font Family</Label>
            <Select defaultValue="Inter">
              <SelectTrigger data-testid="select-font-family">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOOGLE_FONTS.map(font => (
                  <SelectItem key={font} value={font}>{font}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Font Size</Label>
            <div className="flex items-center gap-3">
              <Slider
                data-testid="slider-font-size"
                defaultValue={[60]}
                min={12}
                max={120}
                step={1}
                className="flex-1"
              />
              <Input
                data-testid="input-font-size"
                type="number"
                defaultValue={60}
                className="w-16 text-center"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Font Weight</Label>
            <div className="grid grid-cols-3 gap-2">
              {FONT_WEIGHTS.map(weight => (
                <Button
                  key={weight.value}
                  variant="outline"
                  size="sm"
                  data-testid={`button-weight-${weight.value}`}
                  className="toggle-elevate"
                >
                  {weight.label}
                </Button>
              ))}
            </div>
          </div>

          <ColorPicker
            color="#1f2937"
            onChange={(color) => console.log("Text color:", color)}
            label="Text Color"
          />

          <div>
            <Label className="text-sm font-medium mb-2 block">Alignment</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                data-testid="button-align-left"
                className="toggle-elevate"
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                data-testid="button-align-center"
                className="toggle-elevate"
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                data-testid="button-align-right"
                className="toggle-elevate"
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
