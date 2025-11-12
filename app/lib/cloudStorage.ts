// Cloud storage service for templates using JSONBin.io (free service)
// This provides persistent storage across browsers and devices

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3';
const COLLECTION_NAME = 'xbanner-templates';

interface CloudStorageConfig {
  apiKey?: string;
  binId?: string;
}

class CloudStorage {
  private config: CloudStorageConfig = {};
  
  constructor() {
    // Try to get stored config from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('xbanner-cloud-config');
      if (stored) {
        try {
          this.config = JSON.parse(stored);
        } catch (e) {
          console.warn('Failed to parse cloud config');
        }
      }
    }
  }

  private saveConfig() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('xbanner-cloud-config', JSON.stringify(this.config));
    }
  }

  async setupCloudStorage(): Promise<{ binId: string; accessKey: string } | null> {
    try {
      // Create a new bin for this user
      const response = await fetch(`${JSONBIN_API_URL}/b`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: COLLECTION_NAME,
          templates: [],
          createdAt: Date.now(),
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create cloud storage');
      }

      const data = await response.json();
      const binId = data.metadata.id;
      const accessKey = data.metadata.private ? 'private' : 'public';

      this.config = { binId, apiKey: accessKey };
      this.saveConfig();

      return { binId, accessKey };
    } catch (error) {
      console.error('Failed to setup cloud storage:', error);
      return null;
    }
  }

  async saveToCloud(templates: any[]): Promise<boolean> {
    if (!this.config.binId) {
      // Auto-setup if not configured
      const setup = await this.setupCloudStorage();
      if (!setup) return false;
    }

    try {
      const response = await fetch(`${JSONBIN_API_URL}/b/${this.config.binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: COLLECTION_NAME,
          templates,
          updatedAt: Date.now(),
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to save to cloud:', error);
      return false;
    }
  }

  async loadFromCloud(): Promise<any[] | null> {
    if (!this.config.binId) return null;

    try {
      const response = await fetch(`${JSONBIN_API_URL}/b/${this.config.binId}/latest`);
      
      if (!response.ok) return null;

      const data = await response.json();
      return data.record?.templates || [];
    } catch (error) {
      console.error('Failed to load from cloud:', error);
      return null;
    }
  }

  isConfigured(): boolean {
    return Boolean(this.config.binId);
  }

  getCloudInfo(): { binId?: string; configured: boolean } {
    return {
      binId: this.config.binId,
      configured: this.isConfigured(),
    };
  }

  clearConfig() {
    this.config = {};
    if (typeof window !== 'undefined') {
      localStorage.removeItem('xbanner-cloud-config');
    }
  }
}

export const cloudStorage = new CloudStorage();