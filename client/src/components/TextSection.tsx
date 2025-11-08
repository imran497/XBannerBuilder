import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import ColorPicker from "./ColorPicker";
import { TextProperties } from "./BannerCanvas";

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

interface TextSectionProps {
  selectedTextProperties: TextProperties | null;
  onTextPropertiesChange: (props: Partial<TextProperties>) => void;
}

export default function TextSection({ selectedTextProperties, onTextPropertiesChange }: TextSectionProps) {
  const [textContent, setTextContent] = useState("");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState(60);
  const [fontWeight, setFontWeight] = useState("700");
  const [textColor, setTextColor] = useState("#1f2937");
  const [textAlign, setTextAlign] = useState("left");

  useEffect(() => {
    if (selectedTextProperties) {
      setTextContent(selectedTextProperties.text);
      setFontFamily(selectedTextProperties.fontFamily);
      setFontSize(selectedTextProperties.fontSize);
      setFontWeight(selectedTextProperties.fontWeight);
      setTextColor(selectedTextProperties.fill);
      setTextAlign(selectedTextProperties.textAlign);
    }
  }, [selectedTextProperties]);
  const isTextSelected = selectedTextProperties !== null;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="text">
        <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide px-4">
          Text
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          {!isTextSelected && (
            <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/50 rounded-md">
              Select a text object on the canvas to edit its properties
            </div>
          )}

          <div>
            <Label className="text-sm font-medium mb-2 block">Text Content</Label>
            <Input
              data-testid="input-text-content"
              placeholder="Enter your text..."
              value={textContent}
              onChange={(e) => {
                setTextContent(e.target.value);
                onTextPropertiesChange({ text: e.target.value });
              }}
              disabled={!isTextSelected}
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Font Family</Label>
            <Select 
              value={fontFamily} 
              onValueChange={(value) => {
                setFontFamily(value);
                onTextPropertiesChange({ fontFamily: value });
              }}
              disabled={!isTextSelected}
            >
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
                value={[fontSize]}
                onValueChange={(value) => {
                  setFontSize(value[0]);
                  onTextPropertiesChange({ fontSize: value[0] });
                }}
                min={12}
                max={120}
                step={1}
                className="flex-1"
                disabled={!isTextSelected}
              />
              <Input
                data-testid="input-font-size"
                type="number"
                value={fontSize}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 12;
                  setFontSize(value);
                  onTextPropertiesChange({ fontSize: value });
                }}
                className="w-16 text-center"
                disabled={!isTextSelected}
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
                  className={`toggle-elevate ${fontWeight === weight.value ? 'toggle-elevated' : ''}`}
                  onClick={() => {
                    setFontWeight(weight.value);
                    onTextPropertiesChange({ fontWeight: weight.value });
                  }}
                  disabled={!isTextSelected}
                >
                  {weight.label}
                </Button>
              ))}
            </div>
          </div>

          <ColorPicker
            color={textColor}
            onChange={(color) => {
              setTextColor(color);
              onTextPropertiesChange({ fill: color });
            }}
            label="Text Color"
          />

          <div>
            <Label className="text-sm font-medium mb-2 block">Alignment</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                data-testid="button-align-left"
                className={`toggle-elevate ${textAlign === 'left' ? 'toggle-elevated' : ''}`}
                onClick={() => {
                  setTextAlign('left');
                  onTextPropertiesChange({ textAlign: 'left' });
                }}
                disabled={!isTextSelected}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                data-testid="button-align-center"
                className={`toggle-elevate ${textAlign === 'center' ? 'toggle-elevated' : ''}`}
                onClick={() => {
                  setTextAlign('center');
                  onTextPropertiesChange({ textAlign: 'center' });
                }}
                disabled={!isTextSelected}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                data-testid="button-align-right"
                className={`toggle-elevate ${textAlign === 'right' ? 'toggle-elevated' : ''}`}
                onClick={() => {
                  setTextAlign('right');
                  onTextPropertiesChange({ textAlign: 'right' });
                }}
                disabled={!isTextSelected}
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
