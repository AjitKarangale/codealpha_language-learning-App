// Web Notifications & Push Reminders Manager

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
}

export class NotificationManager {
  private static STORAGE_KEY = 'linguapulse_notifications';

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public static getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const result = await Notification.requestPermission();
      return result === 'granted';
    } catch {
      return false;
    }
  }

  public static async sendNotification(payload: PushNotificationPayload): Promise<boolean> {
    const icon = payload.icon || '/src/assets/images/mascot_owl_badge_1791732878866.jpg';

    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        // Try Service Worker registration first
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg && 'showNotification' in reg) {
            await reg.showNotification(payload.title, {
              body: payload.body,
              icon,
              badge: icon,
              tag: payload.tag || 'linguapulse-reminder',
            });
            return true;
          }
        }

        // Fallback to standard window Notification
        new Notification(payload.title, {
          body: payload.body,
          icon,
          tag: payload.tag || 'linguapulse-reminder'
        });
        return true;
      } catch (err) {
        console.warn('Native notification failed:', err);
      }
    }

    return false;
  }

  public static scheduleDailyCheck(
    reminderTime: string, // "20:00"
    streakCount: number,
    isTodayCompleted: boolean,
    onTrigger?: (title: string, body: string) => void
  ) {
    if (typeof window === 'undefined') return () => {};

    const checkInterval = setInterval(() => {
      if (isTodayCompleted) return;

      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      if (currentTimeStr === reminderTime) {
        const title = `🔥 LinguaPulse: Keep your ${streakCount}-day streak alive!`;
        const body = `You haven't completed your daily vocabulary challenge yet. 5 minutes is all it takes!`;

        this.sendNotification({ title, body });
        if (onTrigger) onTrigger(title, body);
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }
}
