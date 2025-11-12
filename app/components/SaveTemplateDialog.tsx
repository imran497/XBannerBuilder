'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Save, Heart } from "lucide-react";
import { TemplateManager, SavedTemplate } from "../lib/templates";

interface SaveTemplateDialogProps {
  onSave: (templateData: {
    name: string;
    description?: string;
    background: string;
    canvasData: any;
  }) => void;
  background: string;
  canvasRef: React.RefObject<any>;
}

export default function SaveTemplateDialog({ onSave, background, canvasRef }: SaveTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;

    setSaving(true);
    
    try {
      const canvas = canvasRef.current?.getCanvas();
      if (!canvas) {
        throw new Error('No canvas available');
      }

      // Generate thumbnail
      const thumbnail = canvas.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 0.3, // Smaller for thumbnail
      });

      // Extract text objects
      const textObjects = canvas.getObjects()
        .filter((obj: any) => obj.type === 'i-text')
        .map((obj: any) => ({
          text: obj.text || '',
          fontFamily: obj.fontFamily || 'Inter',
          fontSize: obj.fontSize || 40,
          fontWeight: String(obj.fontWeight || '400'),
          fill: String(obj.fill || '#000000'),
          left: obj.left || 0,
          top: obj.top || 0,
          textAlign: obj.textAlign || 'left'
        }));

      // Extract image objects
      const images = canvas.getObjects()
        .filter((obj: any) => obj.type === 'image')
        .map((obj: any) => ({
          url: obj.src || obj._originalElement?.src || '',
          left: obj.left || 0,
          top: obj.top || 0,
          scaleX: obj.scaleX || 1,
          scaleY: obj.scaleY || 1
        }))
        .filter((img: any) => img.url); // Only keep images with valid URLs

      const savedTemplate = TemplateManager.saveTemplate({
        name: name.trim(),
        description: description.trim() || undefined,
        background,
        thumbnail,
        textObjects,
        images
      });

      // Notify parent
      onSave({
        name: name.trim(),
        description: description.trim(),
        background,
        canvasData: savedTemplate
      });

      // Reset form
      setName("");
      setDescription("");
      setOpen(false);

    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Save as Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Template</DialogTitle>
          <DialogDescription>
            Save your current design as a template for future inspiration. Templates are stored locally on your device.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              placeholder="e.g., Developer Portfolio Banner"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this template..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            disabled={!name.trim() || saving}
          >
            {saving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}