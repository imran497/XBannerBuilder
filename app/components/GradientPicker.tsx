'use client'

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ColorPicker from "./ColorPicker";

export interface Gradient {
  type: "linear" | "radial";
  angle: number;
  stops: Array<{ color: string; position: number }>;
}

interface GradientPickerProps {
  gradient: Gradient;
  onChange: (gradient: Gradient) => void;
}

const presetGradients: Gradient[] = [
  {
    type: "linear",
    angle: 135,
    stops: [
      { color: "#667eea", position: 0 },
      { color: "#764ba2", position: 100 }
    ]
  },
  {
    type: "linear",
    angle: 90,
    stops: [
      { color: "#f093fb", position: 0 },
      { color: "#f5576c", position: 100 }
    ]
  },
  {
    type: "linear",
    angle: 45,
    stops: [
      { color: "#4facfe", position: 0 },
      { color: "#00f2fe", position: 100 }
    ]
  },
  {
    type: "linear",
    angle: 135,
    stops: [
      { color: "#43e97b", position: 0 },
      { color: "#38f9d7", position: 100 }
    ]
  }
];

export default function GradientPicker({ gradient, onChange }: GradientPickerProps) {
  const gradientCSS = `linear-gradient(${gradient.angle}deg, ${gradient.stops.map(s => `${s.color} ${s.position}%`).join(", ")})`;

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-2 block text-foreground">Preset Gradients</Label>
        <div className="grid grid-cols-4 gap-2">
          {presetGradients.map((preset, idx) => {
            const presetCSS = `linear-gradient(${preset.angle}deg, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(", ")})`;
            return (
              <button
                key={idx}
                data-testid={`button-preset-gradient-${idx}`}
                onClick={() => onChange(preset)}
                className="h-12 rounded-md hover:scale-105 transition-transform hover-elevate active-elevate-2 shadow-sm"
                style={{ background: presetCSS }}
              />
            );
          })}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block text-foreground">Custom Gradient</Label>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Angle</Label>
            <Select
              value={gradient.angle.toString()}
              onValueChange={(v) => onChange({ ...gradient, angle: parseInt(v) })}
            >
              <SelectTrigger data-testid="select-gradient-angle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0° (Top)</SelectItem>
                <SelectItem value="45">45° (Top Right)</SelectItem>
                <SelectItem value="90">90° (Right)</SelectItem>
                <SelectItem value="135">135° (Bottom Right)</SelectItem>
                <SelectItem value="180">180° (Bottom)</SelectItem>
                <SelectItem value="225">225° (Bottom Left)</SelectItem>
                <SelectItem value="270">270° (Left)</SelectItem>
                <SelectItem value="315">315° (Top Left)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {gradient.stops.map((stop, idx) => (
            <ColorPicker
              key={idx}
              label={`Color ${idx + 1}`}
              color={stop.color}
              onChange={(color) => {
                const newStops = [...gradient.stops];
                newStops[idx] = { ...stop, color };
                onChange({ ...gradient, stops: newStops });
              }}
            />
          ))}

          <div 
            className="h-12 rounded-md shadow-sm"
            style={{ background: gradientCSS }}
          />
        </div>
      </div>
    </div>
  );
}
