'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Trash2, Download, Calendar, Cloud, CloudOff, RefreshCw } from "lucide-react";
import { TemplateManager, SavedTemplate } from "../lib/templates";
import TemplatePreview from "./TemplatePreview";

interface TemplatesSectionProps {
  onLoadTemplate: (template: SavedTemplate) => void;
}

export default function TemplatesSection({ onLoadTemplate }: TemplatesSectionProps) {
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [cloudStatus, setCloudStatus] = useState(TemplateManager.getCloudStatus());

  useEffect(() => {
    const loadTemplatesAsync = async () => {
      // Try to load from cloud first
      await TemplateManager.loadFromCloud();
      // Then load all templates (local + cloud)
      loadTemplates();
    };
    
    loadTemplatesAsync();
  }, []);

  const loadTemplates = () => {
    setTemplates(TemplateManager.getAllTemplates());
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      TemplateManager.deleteTemplate(templateId);
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      if (selectedTemplate === templateId) {
        setSelectedTemplate(null);
      }
    }
  };

  const handleLoadTemplate = (template: SavedTemplate) => {
    onLoadTemplate(template);
    setSelectedTemplate(template.id);
  };

  const handleSyncToCloud = async () => {
    setSyncing(true);
    try {
      if (!cloudStatus.configured) {
        await TemplateManager.setupCloudSync();
      } else {
        await TemplateManager.syncToCloud();
        await TemplateManager.loadFromCloud();
        loadTemplates();
      }
      setCloudStatus(TemplateManager.getCloudStatus());
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (templates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Saved Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-sm">No saved templates yet.</p>
            <p className="text-xs">Create a banner and save it as a template!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Saved Templates ({templates.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {cloudStatus.configured ? (
                <>
                  <Cloud className="w-3 h-3 text-green-500" />
                  <span>Cloud synced</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3 h-3" />
                  <span>Local only</span>
                </>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSyncToCloud}
              disabled={syncing}
              className="h-7 px-2 text-xs"
            >
              {syncing ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Cloud className="w-3 h-3" />
              )}
              {syncing ? 'Syncing...' : cloudStatus.configured ? 'Sync' : 'Setup Cloud'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className={`border rounded-lg p-3 transition-colors hover:bg-muted/50 ${
                  selectedTemplate === template.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-20 h-12 rounded overflow-hidden">
                    <TemplatePreview 
                      template={template}
                      width={80}
                      height={48}
                      className="w-full h-full"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">
                      {template.name}
                    </h4>
                    {template.description && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {template.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() => handleLoadTemplate(template)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}