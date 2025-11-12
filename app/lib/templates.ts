export interface SavedTemplate {
  id: string;
  name: string;
  description?: string;
  background: string;
  thumbnail: string; // Base64 data URL
  textObjects: Array<{
    text: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    fill: string;
    left: number;
    top: number;
    textAlign: string;
  }>;
  images: Array<{
    url: string;
    left: number;
    top: number;
    scaleX: number;
    scaleY: number;
  }>;
  createdAt: number;
  updatedAt: number;
}

import { cloudStorage } from './cloudStorage';

const TEMPLATES_KEY = 'xbanner-saved-templates';

export class TemplateManager {
  static saveTemplate(template: Omit<SavedTemplate, 'id' | 'createdAt' | 'updatedAt'>): SavedTemplate {
    const now = Date.now();
    const savedTemplate: SavedTemplate = {
      ...template,
      id: `template-${now}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now
    };

    const templates = this.getAllTemplates();
    templates.unshift(savedTemplate); // Add to beginning

    // Keep only latest 20 templates
    if (templates.length > 20) {
      templates.splice(20);
    }

    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    
    // Sync to cloud in background
    this.syncToCloud().catch(console.warn);
    
    return savedTemplate;
  }

  static getAllTemplates(): SavedTemplate[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(TEMPLATES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load templates:', error);
      return [];
    }
  }

  static deleteTemplate(templateId: string): void {
    const templates = this.getAllTemplates().filter(t => t.id !== templateId);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    
    // Sync to cloud in background
    this.syncToCloud().catch(console.warn);
  }

  static updateTemplate(templateId: string, updates: Partial<SavedTemplate>): void {
    const templates = this.getAllTemplates();
    const index = templates.findIndex(t => t.id === templateId);
    
    if (index !== -1) {
      templates[index] = {
        ...templates[index],
        ...updates,
        updatedAt: Date.now()
      };
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
    }
  }

  static getTemplate(templateId: string): SavedTemplate | null {
    return this.getAllTemplates().find(t => t.id === templateId) || null;
  }

  static exportTemplates(): string {
    return JSON.stringify(this.getAllTemplates(), null, 2);
  }

  static importTemplates(jsonData: string): void {
    try {
      const templates = JSON.parse(jsonData);
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
      
      // Sync to cloud in background
      this.syncToCloud().catch(console.warn);
    } catch (error) {
      throw new Error('Invalid template data');
    }
  }

  // Cloud synchronization methods
  static async syncToCloud(): Promise<boolean> {
    try {
      const templates = this.getAllTemplates();
      return await cloudStorage.saveToCloud(templates);
    } catch (error) {
      console.warn('Failed to sync to cloud:', error);
      return false;
    }
  }

  static async loadFromCloud(): Promise<boolean> {
    try {
      const cloudTemplates = await cloudStorage.loadFromCloud();
      if (cloudTemplates && Array.isArray(cloudTemplates)) {
        // Merge with local templates, avoiding duplicates
        const localTemplates = this.getAllTemplates();
        const allTemplates = [...cloudTemplates];
        
        // Add local templates that aren't in cloud
        localTemplates.forEach(local => {
          if (!cloudTemplates.find(cloud => cloud.id === local.id)) {
            allTemplates.push(local);
          }
        });

        // Sort by creation date and limit to 20
        allTemplates.sort((a, b) => b.createdAt - a.createdAt);
        allTemplates.splice(20);

        localStorage.setItem(TEMPLATES_KEY, JSON.stringify(allTemplates));
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Failed to load from cloud:', error);
      return false;
    }
  }

  static async setupCloudSync(): Promise<boolean> {
    try {
      const result = await cloudStorage.setupCloudStorage();
      if (result) {
        // Sync current templates to cloud
        await this.syncToCloud();
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Failed to setup cloud sync:', error);
      return false;
    }
  }

  static getCloudStatus(): { configured: boolean; binId?: string } {
    return cloudStorage.getCloudInfo();
  }

  static clearCloudConfig() {
    cloudStorage.clearConfig();
  }
}