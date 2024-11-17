import { openDB, IDBPDatabase } from 'idb';
import notificationService from '../notifications/notificationService';

interface SyncItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  endpoint: string;
  data: any;
  timestamp: number;
  retries: number;
}

class OfflineService {
  private static instance: OfflineService;
  private db: IDBPDatabase | null = null;
  private isOnline: boolean = navigator.onLine;
  private syncQueue: SyncItem[] = [];
  private readonly MAX_RETRIES = 3;

  private constructor() {
    this.initializeDB();
    this.setupEventListeners();
  }

  public static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  private async initializeDB() {
    try {
      this.db = await openDB('travelPlannerOfflineDB', 1, {
        upgrade(db) {
          // Store for offline data
          db.createObjectStore('offlineData', { keyPath: 'id' });
          // Store for sync queue
          db.createObjectStore('syncQueue', { keyPath: 'id' });
        },
      });
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      notificationService.error('Failed to initialize offline storage');
    }
  }

  private setupEventListeners() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    this.isOnline = true;
    notificationService.success('Back online! Syncing data...');
    this.processSyncQueue();
  };

  private handleOffline = () => {
    this.isOnline = false;
    notificationService.warning('You are offline. Changes will be saved locally.');
  };

  async saveOfflineData(key: string, data: any) {
    if (!this.db) return;

    try {
      await this.db.put('offlineData', {
        id: key,
        data,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Failed to save offline data:', error);
      throw error;
    }
  }

  async getOfflineData(key: string) {
    if (!this.db) return null;

    try {
      return await this.db.get('offlineData', key);
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return null;
    }
  }

  async queueSync(item: Omit<SyncItem, 'id' | 'timestamp' | 'retries'>) {
    if (!this.db) return;

    const syncItem: SyncItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0,
    };

    try {
      await this.db.add('syncQueue', syncItem);
      this.syncQueue.push(syncItem);

      if (this.isOnline) {
        this.processSyncQueue();
      }
    } catch (error) {
      console.error('Failed to queue sync item:', error);
      throw error;
    }
  }

  private async processSyncQueue() {
    if (!this.db || !this.isOnline || this.syncQueue.length === 0) return;

    const queue = [...this.syncQueue];
    this.syncQueue = [];

    for (const item of queue) {
      try {
        await this.syncItem(item);
        await this.db.delete('syncQueue', item.id);
      } catch (error) {
        console.error('Failed to sync item:', error);
        if (item.retries < this.MAX_RETRIES) {
          item.retries++;
          this.syncQueue.push(item);
        } else {
          notificationService.error('Failed to sync some changes. Please try again later.');
          await this.db.delete('syncQueue', item.id);
        }
      }
    }
  }

  private async syncItem(item: SyncItem) {
    const { action, endpoint, data } = item;

    switch (action) {
      case 'create':
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        break;

      case 'update':
        await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        break;

      case 'delete':
        await fetch(endpoint, {
          method: 'DELETE',
        });
        break;
    }
  }

  isOffline(): boolean {
    return !this.isOnline;
  }

  cleanup() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }
}

export default OfflineService.getInstance();
