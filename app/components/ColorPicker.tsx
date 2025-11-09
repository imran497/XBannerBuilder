'use client'

import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium text-foreground">{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <button
            data-testid="button-color-picker"
            className="flex items-center gap-2 w-full h-9 px-3 rounded-md bg-muted/30 text-foreground hover:bg-muted hover-elevate active-elevate-2 focus:bg-background transition-colors"
          >
            <div 
              className="w-5 h-5 rounded shadow-sm"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-mono uppercase text-foreground">{color}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <div className="space-y-3">
            <HexColorPicker color={color} onChange={onChange} />
            <Input
              data-testid="input-color-hex"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="font-mono uppercase text-sm"
              placeholder="#000000"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
