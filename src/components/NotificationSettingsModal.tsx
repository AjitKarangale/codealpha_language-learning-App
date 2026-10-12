import React, { useState } from 'react';
import { Bell, Clock, ShieldAlert, Volume2, Sparkles, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { NotificationSettings } from '../types';
import { NotificationManager } from '../utils/notifications';
import { soundEffects } from '../utils/audio';

interface NotificationSettingsModalProps {
  settings: NotificationSettings;
  streakCount: number;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  settings,
  streakCount,
  onUpdateSettings,
  onClose,
}) => {
  const [permissionState, setPermissionState] = useState<NotificationPermission>(
    NotificationManager.getPermission()
  );
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const handleRequestPermission = async () => {
    soundEffects.playClick();
    const granted = await NotificationManager.requestPermission();
    setPermissionState(NotificationManager.getPermission());
    onUpdateSettings({
      ...settings,
      enabled: granted,
      hasPermission: granted
    });
    if (granted) {
      soundEffects.playSuccess();
    }
  };

  const handleSendTestNotification = async () => {
    soundEffects.playClick();
    soundEffects.playSuccess();

    await NotificationManager.sendNotification({
      title: `🔥 LinguaPulse: Don't break your ${streakCount}-day streak!`,
      body: `It's time for your daily 5-minute vocabulary challenge. Tap to complete today's lesson!`
    });

    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 4000);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({
      ...settings,
      time: e.target.value
    });
  };

  const handlePresetTime = (timeStr: string) => {
    soundEffects.playClick();
    onUpdateSettings({
      ...settings,
      time: timeStr
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 animate-scale-up">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Daily Lesson Reminders
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Never lose your streak with timely push notifications.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Permission Status */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Push Notification Permission
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                permissionState === 'granted'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : permissionState === 'denied'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              {permissionState.toUpperCase()}
            </span>
          </div>

          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {permissionState === 'granted'
              ? 'Push notifications are active. You will receive streak reminders on your device.'
              : permissionState === 'denied'
              ? 'Notifications are blocked in your browser settings. You can still test in-app reminders.'
              : 'Allow browser notifications so you never forget to complete your lesson.'}
          </p>

          {permissionState !== 'granted' && (
            <button
              onClick={handleRequestPermission}
              className="mt-3 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs transition-colors"
            >
              Enable Browser Push Notifications
            </button>
          )}
        </div>

        {/* Reminder Time Picker & Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Preferred Reminder Time
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="time"
                value={settings.time}
                onChange={handleTimeChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handlePresetTime('08:00')}
              className={`px-2.5 py-1 text-[11px] rounded-lg border transition-colors ${
                settings.time === '08:00'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              08:00 AM (Morning)
            </button>
            <button
              type="button"
              onClick={() => handlePresetTime('13:00')}
              className={`px-2.5 py-1 text-[11px] rounded-lg border transition-colors ${
                settings.time === '13:00'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              01:00 PM (Lunch)
            </button>
            <button
              type="button"
              onClick={() => handlePresetTime('20:00')}
              className={`px-2.5 py-1 text-[11px] rounded-lg border transition-colors ${
                settings.time === '20:00'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              08:00 PM (Evening)
            </button>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
          
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Streak Saver Danger Alert
                </span>
                <p className="text-[11px] text-slate-400">
                  Urgent alert 2 hours before midnight if streak is uncompleted
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.streakProtection}
              onChange={(e) =>
                onUpdateSettings({ ...settings, streakProtection: e.target.checked })
              }
              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Audio Sound Chimes
                </span>
                <p className="text-[11px] text-slate-400">
                  Play motivational audio bells during lessons
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => {
                soundEffects.setSoundEnabled(e.target.checked);
                onUpdateSettings({ ...settings, soundEnabled: e.target.checked });
              }}
              className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
          </label>

        </div>

        {/* Test Notification Trigger */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleSendTestNotification}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Test Push Reminder Notification Now</span>
          </button>

          {testNotificationSent && (
            <p className="mt-2 text-center text-xs font-medium text-emerald-600 dark:text-emerald-400 animate-fade-in">
              ✓ Notification triggered successfully! Check your system notification tray.
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
        >
          Save & Close
        </button>

      </div>
    </div>
  );
};
