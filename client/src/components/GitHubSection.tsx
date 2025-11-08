import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github, RefreshCw } from "lucide-react";

export default function GitHubSection() {
  const [isConnected, setIsConnected] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [opacity, setOpacity] = useState([50]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="github">
        <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide px-4">
          GitHub Integration
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          {!isConnected ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Connect your GitHub account to display your contribution heatmap on your banner.
              </p>
              <Button
                className="w-full"
                onClick={() => setIsConnected(true)}
                data-testid="button-connect-github"
              >
                <Github className="w-4 h-4 mr-2" />
                Connect GitHub
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/github.png" />
                  <AvatarFallback>GH</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">octocat</div>
                  <div className="text-xs text-muted-foreground">Connected</div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              </div>

              <Button
                variant="outline"
                className="w-full"
                data-testid="button-sync-contributions"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Contributions
              </Button>

              <div className="flex items-center justify-between">
                <Label htmlFor="heatmap-visible" className="text-sm font-medium">
                  Show Heatmap
                </Label>
                <Switch
                  id="heatmap-visible"
                  checked={showHeatmap}
                  onCheckedChange={setShowHeatmap}
                  data-testid="switch-show-heatmap"
                />
              </div>

              {showHeatmap && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Heatmap Opacity
                  </Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={opacity}
                      onValueChange={setOpacity}
                      min={0}
                      max={100}
                      step={5}
                      data-testid="slider-heatmap-opacity"
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {opacity[0]}%
                    </span>
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setIsConnected(false)}
                data-testid="button-disconnect-github"
              >
                Disconnect
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
