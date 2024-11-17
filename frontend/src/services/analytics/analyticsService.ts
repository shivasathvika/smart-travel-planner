type EventCategory = 'trip' | 'weather' | 'map' | 'user' | 'error';

interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL = 30000; // 30 seconds

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.setupPeriodicFlush();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private setupPeriodicFlush() {
    setInterval(() => this.flush(), this.FLUSH_INTERVAL);
  }

  trackEvent(
    category: EventCategory,
    action: string,
    label?: string,
    value?: number,
    userId?: string
  ) {
    const event: AnalyticsEvent = {
      category,
      action,
      label,
      value,
      userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
    };

    this.events.push(event);

    // Flush if we've reached the batch size
    if (this.events.length >= this.BATCH_SIZE) {
      this.flush();
    }
  }

  trackError(error: Error, context?: string) {
    this.trackEvent('error', 'error_occurred', context || error.name, undefined, undefined);
    
    // Additional error details could be sent here
    console.error('Analytics Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  // Track specific events
  trackTripCreated(tripId: string, userId?: string) {
    this.trackEvent('trip', 'create', tripId, undefined, userId);
  }

  trackTripUpdated(tripId: string, userId?: string) {
    this.trackEvent('trip', 'update', tripId, undefined, userId);
  }

  trackTripDeleted(tripId: string, userId?: string) {
    this.trackEvent('trip', 'delete', tripId, undefined, userId);
  }

  trackWeatherAlert(alertType: string, severity: string, userId?: string) {
    this.trackEvent('weather', 'alert', `${alertType}_${severity}`, undefined, userId);
  }

  trackRouteCalculated(origin: string, destination: string, userId?: string) {
    this.trackEvent(
      'map',
      'route_calculated',
      `${origin}_to_${destination}`,
      undefined,
      userId
    );
  }

  trackUserLogin(userId: string) {
    this.trackEvent('user', 'login', undefined, undefined, userId);
  }

  trackUserLogout(userId: string) {
    this.trackEvent('user', 'logout', undefined, undefined, userId);
  }

  private async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      // In a real application, you would send these events to your analytics backend
      await this.sendEvents(eventsToSend);
    } catch (error) {
      // If sending fails, add the events back to the queue
      this.events = [...eventsToSend, ...this.events];
      console.error('Failed to send analytics events:', error);
    }
  }

  private async sendEvents(events: AnalyticsEvent[]) {
    // This is a placeholder for the actual API call
    // In a real application, you would send these events to your analytics service
    
    // Example implementation:
    // await fetch('/api/analytics/events', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ events }),
    // });

    // For now, just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics events:', events);
    }
  }
}

export default AnalyticsService.getInstance();
