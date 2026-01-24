// src/services/offlineManager.js
import { openDB } from 'idb';

class OfflineManager {
  constructor() {
    this.db = null;
    this.init();
  }

  async init() {
    this.db = await openDB('NaijaAIDocuments', 1, {
      upgrade(db) {
        // Document store
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id' });
        }
        // Chat store
        if (!db.objectStoreNames.contains('chats')) {
          db.createObjectStore('chats', { keyPath: 'id', autoIncrement: true });
        }
        // Queue for syncing
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }

  async saveDocument(doc) {
    await this.db.put('documents', doc);
  }

  async getDocuments() {
    return await this.db.getAll('documents');
  }

  async queueForSync(action, data) {
    await this.db.add('syncQueue', {
      action,
      data,
      timestamp: Date.now(),
      attempts: 0,
    });
  }

  async syncQueue() {
    if (navigator.onLine) {
      const queue = await this.db.getAll('syncQueue');
      
      for (const item of queue) {
        try {
          await this.processQueueItem(item);
          await this.db.delete('syncQueue', item.id);
        } catch (error) {
          item.attempts++;
          if (item.attempts < 3) {
            await this.db.put('syncQueue', item);
          }
        }
      }
    }
  }

  async processQueueItem(item) {
    // Process queued actions when back online
    switch (item.action) {
      case 'UPLOAD_DOCUMENT':
        // Upload document to server
        break;
      case 'SEND_MESSAGE':
        // Send chat message
        break;
    }
  }
}

export const offlineManager = new OfflineManager();