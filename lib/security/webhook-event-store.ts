

interface ProcessedEvent {
  eventId: string;
  processedAt: number;
  eventType: string;
}

class WebhookEventStore {
  private processedEvents: Map<string, ProcessedEvent> = new Map();
  private cleanupInterval: NodeJS.Timeout;
  private readonly MAX_AGE_MS = 24 * 60 * 60 * 1000; 
  private readonly CLEANUP_INTERVAL_MS = 60 * 60 * 1000; 

  constructor() {
    
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL_MS);
  }

  shouldProcess(
    eventId: string,
    eventType: string,
    eventCreatedTimestamp: number
  ): {
    shouldProcess: boolean;
    reason?: string;
  } {
    
    const eventAge = Date.now() - eventCreatedTimestamp * 1000;
    if (eventAge > this.MAX_AGE_MS) {
      return {
        shouldProcess: false,
        reason: `Event is too old: ${Math.floor(eventAge / 1000 / 60)} minutes old`,
      };
    }

    const existing = this.processedEvents.get(eventId);
    if (existing) {
      return {
        shouldProcess: false,
        reason: `Event already processed at ${new Date(existing.processedAt).toISOString()}`,
      };
    }

    return { shouldProcess: true };
  }

  markProcessed(eventId: string, eventType: string): void {
    this.processedEvents.set(eventId, {
      eventId,
      processedAt: Date.now(),
      eventType,
    });
  }

  private cleanup(): void {
    const now = Date.now();
    const cutoff = now - this.MAX_AGE_MS;

    let removedCount = 0;
    for (const [eventId, event] of this.processedEvents.entries()) {
      if (event.processedAt < cutoff) {
        this.processedEvents.delete(eventId);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(
        `[WebhookEventStore] Cleaned up ${removedCount} old events. Current size: ${this.processedEvents.size}`
      );
    }
  }

  getStats(): {
    totalProcessed: number;
    oldestEvent: string | null;
    newestEvent: string | null;
  } {
    if (this.processedEvents.size === 0) {
      return {
        totalProcessed: 0,
        oldestEvent: null,
        newestEvent: null,
      };
    }

    let oldest: ProcessedEvent | null = null;
    let newest: ProcessedEvent | null = null;

    for (const event of this.processedEvents.values()) {
      if (!oldest || event.processedAt < oldest.processedAt) {
        oldest = event;
      }
      if (!newest || event.processedAt > newest.processedAt) {
        newest = event;
      }
    }

    return {
      totalProcessed: this.processedEvents.size,
      oldestEvent: oldest ? new Date(oldest.processedAt).toISOString() : null,
      newestEvent: newest ? new Date(newest.processedAt).toISOString() : null,
    };
  }

  clear(): void {
    this.processedEvents.clear();
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.processedEvents.clear();
  }
}

export const webhookEventStore = new WebhookEventStore();

export function createEventGuard(eventId: string, eventType: string, created: number) {
  const check = webhookEventStore.shouldProcess(eventId, eventType, created);

  return {
    shouldProcess: check.shouldProcess,
    reason: check.reason,
    markProcessed: () => webhookEventStore.markProcessed(eventId, eventType),
  };
}
