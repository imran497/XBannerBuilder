'use client'

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorPicker from "./ColorPicker";
import GradientPicker, { Gradient } from "./GradientPicker";

interface BackgroundSectionProps {
  onBackgroundChange: (background: string) => void;
}

export default function BackgroundSection({ onBackgroundChange }: BackgroundSectionProps) {
  const [backgroundType, setBackgroundType] = useState<"solid" | "gradient">("gradient");
  const [solidColor, setSolidColor] = useState("#ffffff");
  const [gradient, setGradient] = useState<Gradient>({
    type: "linear",
    angle: 135,
    stops: [
      { color: "#ffde4f", position: 0 },
      { color: "#ffffff", position: 100 }
    ]
  });

  const handleSolidChange = (color: string) => {
    setSolidColor(color);
    onBackgroundChange(color);
  };

  const handleGradientChange = (newGradient: Gradient) => {
    setGradient(newGradient);
    const gradientCSS = `linear-gradient(${newGradient.angle}deg, ${newGradient.stops.map(s => `${s.color} ${s.position}%`).join(", ")})`;
    onBackgroundChange(gradientCSS);
  };

  return (
    <Accordion type="single" collapsible defaultValue="background" className="bg-secondary border border-border rounded-lg">
      <AccordionItem value="background" className="border-0">
        <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide px-4 text-foreground hover:bg-muted/30">
          Background
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <Tabs 
            value={backgroundType} 
            onValueChange={(v) => setBackgroundType(v as "solid" | "gradient")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="solid" data-testid="tab-solid">Solid</TabsTrigger>
              <TabsTrigger value="gradient" data-testid="tab-gradient">Gradient</TabsTrigger>
            </TabsList>
            <TabsContent value="solid" className="mt-4">
              <ColorPicker
                color={solidColor}
                onChange={handleSolidChange}
                label="Background Color"
              />
            </TabsContent>
            <TabsContent value="gradient" className="mt-4">
              <GradientPicker
                gradient={gradient}
                onChange={handleGradientChange}
              />
            </TabsContent>
          </Tabs>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
